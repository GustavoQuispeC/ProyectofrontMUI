import { getAuthUser } from "@/shared/auth/auth.service";
import { RegistrarPermiso } from "./permiso.type";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { registrarPermisoApi as registrarPermisoService } from "./permiso.service";
import { listarPermisosPendientesApi as listarPermisosPendientesService } from "./permiso.service";
import { aprobarPermisoApi as aprobarPermisoService } from "./permiso.service";
import { rechazarPermisoApi as rechazarPermisoService } from "./permiso.service";
import { listarPermisosMensualApi as listarPermisosMensualService } from "./permiso.service";

//! Registrar persmiso
export async function registrarPermiso(payload: RegistrarPermiso): Promise<{ permisoId: number }> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.registrarPermiso)) {
    throw new Error("No tienes privilegios para registrar permisos");
  }
  return registrarPermisoService(payload);
}

//! Listar permisos pendientes
export async function listarPermisosPendientes() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.listarPermisosPendientes)) {
    throw new Error("No tienes privilegios para listar permisos pendientes");
  }
  return listarPermisosPendientesService();
}

//! Listar permisos mensual
export async function listarPermisosMensual(anio: number, mes: number) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.listarPermisosMensual)) {
    throw new Error("No tienes privilegios para listar permisos mensuales");
  }
  return listarPermisosMensualService(anio, mes);
}

//! Aprobar permiso
export async function aprobarPermiso(id: number) {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.aprobarPermiso)) {
    throw new Error("No tienes privilegios para aprobar permisos");
  }
  return aprobarPermisoService(id);
}

//! Rechazar permiso
export async function rechazarPermiso(id: number, motivoRechazo: string) {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.rechazarPermiso)) {
    throw new Error("No tienes privilegios para rechazar permisos");
  }
  return rechazarPermisoService(id, motivoRechazo);
}
