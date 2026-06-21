import { getAuthUser } from "@/shared/auth/auth.service";
import {
  registrarEmpleadoApi as registrarEmpleadoService,
  eliminarEmpleadoApi as eliminarEmpleadoService,
} from "@/features/dashboard/empleado/empleado.service";
import {RegistrarEmpleadoRequest, RegistrarEmpleadoResponse} from "./empleado.types";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";

//! Eliminar empleado con validación
export async function eliminarEmpleado(id: string): Promise<void> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.eliminarEmpleado)) {
    throw new Error("No tienes permisos para eliminar usuarios");
  }
  return eliminarEmpleadoService(id);
}

//! Registrar empleado con validación
export async function registrarEmpleado(payload: RegistrarEmpleadoRequest
): Promise<RegistrarEmpleadoResponse> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.registrarEmpleado)) {
    throw new Error("No tienes permisos para registrar empleados");
  }
  return registrarEmpleadoService(payload);
}
