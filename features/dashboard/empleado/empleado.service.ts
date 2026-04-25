import { apiEmpleado } from "@/lib/api-empleado";
import { RegistarEmpleado, VerEmpleado } from "./empleado.types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//! Función para listar empleados
export function listarEmpleadosApi() {
  return apiEmpleado(`${apiUrl}/Empleados`, {
    method: "GET",
  });
}

//! Listar empleado por ID
export async function verEmpleadoApi(id: string): Promise<VerEmpleado> {
  return apiEmpleado(`${apiUrl}/Empleados/${id}`, {
    method: "GET",
  });
}

//! Función para eliminar empleados, token y rol requrido
export async function eliminarEmpleadoApi(id: string): Promise<void> {
  return apiEmpleado(`${apiUrl}/empleados/${id}`, {
    method: "DELETE",
  });
}

//! Función para registrar empleados, token y rol requrido
export async function registrarEmpleadoApi(
  payload: RegistarEmpleado, // recibe del formulario
): Promise<RegistarEmpleado> {
  return apiEmpleado(`${apiUrl}/empleados`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
