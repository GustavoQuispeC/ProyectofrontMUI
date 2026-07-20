import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { RegistrarVacaciones } from "./vacaciones.type";
import {
  listarVacacionesAprobadasApi as listarVacacionesAprobadasService,
  listarVacacionesPendientesApi as listarVacacionesPendientesService,
  registrarVacacionesApi as registrarVacacionesService,
  aprobarVacacionesApi as aprobarVacacionesService,
  cancelarVacacionesAprobadasApi as cancelarVacacionesAprobadasService,
  listarVacacionesResumenApi as listarVacacionesResumenService,
  listarVacacionesByIdApi as listarVacacionesByIdService,
  cancelarVacacionesPendientesApi as cancelarVacacionesPendientesService,
} from "./vacaciones.service";

//! Registrar vacaciones
export async function registrarVacaciones(payload: RegistrarVacaciones): Promise<{ vacacionId: number }> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.registrarVacaciones)) {
    throw new Error("No tienes privilegios para registrar vacaciones");
  }
  return registrarVacacionesService(payload);
}

//! Listar vacaciones aprobadas
export async function listarVacacionesAprobadas() {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarVacacionesGenerales)) {
    throw new Error("No tienes privilegios para listar vacaciones generales");
  }
  return listarVacacionesAprobadasService();
}

//! Listar vacaciones pendientes
export async function listarVacacionesPendientes() {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarVacacionesPendientes)) {
    throw new Error("No tienes privilegios para listar vacaciones pendientes");
  }
  return listarVacacionesPendientesService();
}

//! Listar vacaciones resumen
export async function listarVacacionesResumen() {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarVacacionesResumen)) {
    throw new Error("No tienes privilegios para listar vacaciones resumen");
  }
  return listarVacacionesResumenService();
}

//! Listar vacaciones por GUID de usuario
export async function listarVacacionesById(guid: string) {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarVacacionesById)) {
    throw new Error("No tienes privilegios para listar vacaciones por id");
  }
  return listarVacacionesByIdService(guid);
}

//! Aprobar vacaciones
export async function aprobarVacaciones(id: number) {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.aprobarVacaciones)) {
    throw new Error("No tienes privilegios para aprobar vacaciones");
  }
  return aprobarVacacionesService(id);
}

//! Cancelar vacaciones aprobadas
export async function cancelarVacacionesAprobadas(id: number) {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.cancelarVacacionesAprobadas)) {
    throw new Error("No tienes privilegios para cancelar vacaciones aprobadas");
  }
  return cancelarVacacionesAprobadasService(id);
}

//! Cancelar vacaciones pendientes
export async function cancelarVacacionesPendientes(id: number) {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.cancelarVacacionesPendientes)) {
    throw new Error("No tienes privilegios para cancelar vacaciones pendientes");
  }
  return cancelarVacacionesPendientesService(id);
}
