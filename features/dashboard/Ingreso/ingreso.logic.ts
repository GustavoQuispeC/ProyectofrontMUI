import dayjs from "dayjs";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { listarIngresosApi, registrarIngresoApi } from "./ingreso.service";
import { IngresoRegistrado, ListarIngreso, ListarIngresosRequest, RegistrarIngreso } from "./ingreso.type";

function normalizeFecha(value: string | Date | dayjs.Dayjs): string {
  return dayjs(value).format("YYYY-MM-DD");
}

//! Listar ingresos
export async function listarIngresos(params: ListarIngresosRequest): Promise<{
  ingresos: ListarIngreso[];
  totalRegistros: number;
}> {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarIngresos)) {
    throw new Error("No tienes privilegios para listar ingresos");
  }

  return listarIngresosApi(params);
}

//! Registrar ingreso
export async function registrarIngreso(payload: RegistrarIngreso): Promise<IngresoRegistrado> {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.registrarIngreso)) {
    throw new Error("No tienes privilegios para registrar ingresos");
  }

  const data: RegistrarIngreso = {
    ...payload,
    Fecha: normalizeFecha(payload.Fecha as string | Date | dayjs.Dayjs),
    Observaciones: payload.Observaciones?.trim() || null,
  };

  return registrarIngresoApi(data);
}
