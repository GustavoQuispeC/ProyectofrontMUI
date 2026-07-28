import { getAuthUser } from "@/shared/auth/auth.service";
import {
  registrarEmpleadoApi as registrarEmpleadoService,
  desactivarEmpleadoApi as desactivarEmpleadoService,
  actualizarEmpleadoApi as actualizarEmpleadoService,
  reactivarEmpleadoApi as reactivarEmpleadoService,
} from "@/features/dashboard/empleado/empleado.service";
import {
  ActualizarEmpleadoRequest,
  RegistrarEmpleadoRequest,
  RegistrarEmpleadoResponse,
  DesactivarEmpleadoRequest,
  ReactivarEmpleadoRequest,
} from "./empleado.types";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";

//! Desactivar empleado con validación
export async function desactivarEmpleado(id: string, payload?: DesactivarEmpleadoRequest): Promise<void> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.eliminarEmpleado)) {
    throw new Error("No tienes permisos para desactivar empleados");
  }
  return desactivarEmpleadoService(id, payload);
}

//! Registrar empleado con validación
export async function registrarEmpleado(payload: RegistrarEmpleadoRequest): Promise<RegistrarEmpleadoResponse> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.registrarEmpleado)) {
    throw new Error("No tienes permisos para registrar empleados");
  }
  return registrarEmpleadoService(payload);
}

//! Actualizar empleado con validación
export async function actualizarEmpleado(id: string, payload: ActualizarEmpleadoRequest): Promise<void> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.editarEmpleado)) {
    throw new Error("No tienes permisos para editar empleados");
  }
  return actualizarEmpleadoService(id, payload);
}

//! Reactivar empleado con validación
export async function reactivarEmpleado(id: string, payload: ReactivarEmpleadoRequest): Promise<void> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.editarEmpleado)) {
    throw new Error("No tienes permisos para reactivar empleados");
  }
  return reactivarEmpleadoService(id, payload);
}
