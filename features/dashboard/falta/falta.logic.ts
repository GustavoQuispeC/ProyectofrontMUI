import { getAuthUser } from "@/shared/auth/auth.service";
import { registrarFaltaApi as registrarFaltaService } from "./falta.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import {
  listarFaltasPendientesApi as listarFaltasPendientesService,
  aprobarFaltaApi as aprobarFaltaService,
  cancelarFaltaApi as cancelarFaltaService,
  listarFaltaMensualApi as listarFaltaMensualService,
} from "./falta.service";
import { RegistrarFalta } from "./falta.type";

//! Registrar permiso
export async function registrarFalta(payload: RegistrarFalta): Promise<{ faltaId: number }> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.registrarFalta)) {
    throw new Error("No tienes privilegios para registrar faltas");
  }
  return registrarFaltaService(payload);
}

//! Listar faltas pendientes
export async function listarFaltasPendientes() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.listarFaltasPendientes)) {
    throw new Error("No tienes privilegios para listar faltas pendientes");
  }
  return listarFaltasPendientesService();
}

//! Aprobar Falta
export async function aprobarFalta(faltaId: number): Promise<void> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.aprobarFalta)) {
    throw new Error("No tienes privilegios para aprobar faltas");
  }
  return aprobarFaltaService(faltaId);
}

//! Cancelar Falta
export async function cancelarFalta(faltaId: number): Promise<void> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.cancelarFalta)) {
    throw new Error("No tienes privilegios para cancelar faltas");
  }
  return cancelarFaltaService(faltaId);
}

//! Listar falta mensual
export async function listarFaltaMensual(anio: number, mes: number) {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarFaltaMensual)) {
    throw new Error("No tienes privilegios para listar faltas mensuales");
  }
  return listarFaltaMensualService(anio, mes);
}
