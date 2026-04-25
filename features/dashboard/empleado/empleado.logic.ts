import { getAuthUser } from "@/shared/auth/auth.service";

import {
  registrarEmpleadoApi as registrarEmpleadoService,
  eliminarEmpleadoApi as eliminarEmpleadoService,
} from "@/features/dashboard/empleado/empleado.service";
import { RegistarEmpleado } from "./empleado.types";

//! eliminar empleado con validación
export async function eliminarEmpleado(id: string): Promise<void> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  if (user.rol !== "Admin" && user.rol !== "Supervisor") {
    throw new Error("No tienes permisos para eliminar empleados");
  }

  return eliminarEmpleadoService(id);
}

//! registrar empleado con validación
export async function registrarEmpleado(
  payload: RegistarEmpleado, // recibe del formulario
): Promise<RegistarEmpleado> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (user.rol !== "Admin" && user.rol !== "Supervisor") {
    throw new Error("No tienes permisos para registrar empleados");
  }

  return registrarEmpleadoService(payload);
}
