import dayjs from "dayjs";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { listarTransferenciasApi, registrarTransferenciaApi } from "./transferencia.service";
import {
  ListarTransferencia,
  ListarTransferenciasRequest,
  RegistrarTransferencia,
  TransferenciaRegistrada,
} from "./transferencia.type";

function normalizeFecha(value: string | Date | dayjs.Dayjs): string {
  return dayjs(value).format("YYYY-MM-DD");
}

//! Listar transferencias
export async function listarTransferencias(params: ListarTransferenciasRequest): Promise<{
  transferencias: ListarTransferencia[];
  totalRegistros: number;
}> {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarTransferencias)) {
    throw new Error("No tienes privilegios para listar transferencias");
  }

  return listarTransferenciasApi(params);
}

//! Registrar transferencia
export async function registrarTransferencia(payload: RegistrarTransferencia): Promise<TransferenciaRegistrada> {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.registrarTransferencia)) {
    throw new Error("No tienes privilegios para registrar transferencias");
  }

  const data: RegistrarTransferencia = {
    ...payload,
    Fecha: normalizeFecha(payload.Fecha as string | Date | dayjs.Dayjs),
    Motivo: payload.Motivo?.trim() || null,
  };

  return registrarTransferenciaApi(data);
}
