import { apiVacaciones } from "@/lib/api-vacaciones";
import { ListarEmpleadoVacaciones, RegistrarVacaciones } from "./vacaciones.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//!Registrar Vacaciones
export async function registrarVacacionesApi(data: RegistrarVacaciones): Promise<{ vacacionId: number }> {
  return apiVacaciones<{ vacacionId: number }>(`${apiUrl}/Vacacion`, { method: "POST", body: JSON.stringify(data) });
}

//! Listar vacaciones aprobadas
export async function listarVacacionesAprobadasApi(): Promise<ListarEmpleadoVacaciones[]> {
  return apiVacaciones<ListarEmpleadoVacaciones[]>(`${apiUrl}/Vacacion/aprobadas`, { method: "GET" });
}

//! Listar Vacaciones pendientes
export async function listarVacacionesPendientesApi(): Promise<ListarEmpleadoVacaciones[]> {
  return apiVacaciones<ListarEmpleadoVacaciones[]>(`${apiUrl}/Vacacion/pendientes`, {
    method: "GET",
  });
}

//! Listar Vacaciones resumen
export async function listarVacacionesResumenApi(): Promise<ListarEmpleadoVacaciones[]> {
  return apiVacaciones<ListarEmpleadoVacaciones[]>(`${apiUrl}/Vacacion/resumen`, {
    method: "GET",
  });
}

//! Listar Vacaciones por GUID de usuario
export async function listarVacacionesByIdApi(guid: string): Promise<ListarEmpleadoVacaciones> {
  return apiVacaciones<ListarEmpleadoVacaciones>(`${apiUrl}/Vacacion/resumen/${guid}`, {
    method: "GET",
  });
}

//! Aprobar vacaciones
export async function aprobarVacacionesApi(id: number): Promise<void> {
  return apiVacaciones(`${apiUrl}/Vacacion/${id}/aprobar`, {
    method: "PUT",
  });
}

//! Cancelar vacaciones
export async function cancelarVacacionesApi(id: number): Promise<{ mensaje?: string }> {
  return apiVacaciones(`${apiUrl}/Vacacion/${id}/cancelar`, {
    method: "PUT",
  });
}
