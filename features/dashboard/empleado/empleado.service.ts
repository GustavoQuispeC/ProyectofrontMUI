import { apiEmpleado } from "@/lib/api-empleado";
import {
  EmpleadosListar,
  RegistrarEmpleadoRequest,
  EmpleadoAutocomplete,
  RegistrarEmpleadoResponse,
  DetalleEmpleadoResponse,
  ActualizarEmpleadoRequest,
  EmpleadoEdicionResponse,
  DesactivarEmpleadoRequest,
  ReactivarEmpleadoRequest,
} from "./empleado.types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Función para listar empleados
export async function listarEmpleadosApi(): Promise<EmpleadosListar[]> {
  return apiEmpleado(`${apiUrl}/Empleados`, {
    method: "GET",
  });
}

//! Listar empleado por ID
export async function obtenerDetalleEmpleadoApi(id: number): Promise<DetalleEmpleadoResponse> {
  return apiEmpleado(`${apiUrl}/Empleados/${id}`, {
    method: "GET",
  });
}

//! Función para desactivar empleados, token y rol requerido
export async function desactivarEmpleadoApi(id: string, payload?: DesactivarEmpleadoRequest): Promise<void> {
  return apiEmpleado(`${apiUrl}/empleados/${id}/desactivar`, {
    method: "PUT",
    body: JSON.stringify(payload || { motivoEgreso: "" }),
  });
}

//! Función para reactivar empleados, token y rol requerido
export async function reactivarEmpleadoApi(id: string, payload: ReactivarEmpleadoRequest): Promise<void> {
  return apiEmpleado(`${apiUrl}/empleados/${id}/reactivar`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

//! Función para registrar empleados, token y rol requrido
export async function registrarEmpleadoApi(payload: RegistrarEmpleadoRequest): Promise<RegistrarEmpleadoResponse> {
  console.log(payload);
  return apiEmpleado(`${apiUrl}/empleados`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

//! Obtener datos de empleado para edición
export async function obtenerEmpleadoEdicionApi(id: string): Promise<EmpleadoEdicionResponse> {
  return apiEmpleado(`${apiUrl}/empleados/${id}/edicion`, {
    method: "GET",
  });
}

//! Función para actualizar empleados, token y rol requerido
export async function actualizarEmpleadoApi(id: string, payload: ActualizarEmpleadoRequest): Promise<void> {
  return apiEmpleado(`${apiUrl}/empleados/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

//! Función para listar empleados activos para autocomplete
export async function listarEmpleadosActivosApi(): Promise<EmpleadoAutocomplete[]> {
  return apiEmpleado(`${apiUrl}/Empleados/autocomplete`, {
    method: "GET",
  });
}
