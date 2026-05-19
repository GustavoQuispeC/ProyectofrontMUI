import { apiEmpleado } from "@/lib/api-empleado";
import { EmpleadosListar, RegistarEmpleado, DetalleEmpleado, EmpleadoAutocomplete } from "./empleado.types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Función para listar empleados
export async function listarEmpleadosApi(): Promise<EmpleadosListar[]> {
  return apiEmpleado(`${apiUrl}/Empleados`, {
    method: "GET",
  });
}

//! Listar empleado por ID
export async function detalleEmpleadoApi(id: string): Promise<DetalleEmpleado> {
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
export async function registrarEmpleadoApi(payload: RegistarEmpleado): Promise<RegistarEmpleado> {
  return apiEmpleado(`${apiUrl}/Empleados`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

//! Función para listar empleados activos para autocomplete
export async function listarEmpleadosActivosApi(): Promise<EmpleadoAutocomplete[]> {
  return apiEmpleado(`${apiUrl}/Empleados/autocomplete`, {
    method: "GET",
  });
}
