import { apiVacaciones } from "@/lib/api-vacaciones";
import { ListarEmpleadoVacaciones, RegistrarVacaciones } from "./vacaciones.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//!Registrar Vacaciones
export async function registrarVacacionesApi(data: RegistrarVacaciones): Promise<{ vacacionId: number }> {
  return apiVacaciones<{ vacacionId: number }>(`${apiUrl}/Vacacion`, { method: "POST", body: JSON.stringify(data) });
}

//! Listar vacaciones aprobadas
export async function listarVacacionesApi(): Promise<ListarEmpleadoVacaciones[]> {
  return apiVacaciones(`${apiUrl}/Vacacion/reporte-general`, {
    method: "GET",
  });
}

//! Listar Vacaciones pendientes
export async function listarVacacionesPendientesApi(): Promise<ListarEmpleadoVacaciones[]> {
  return apiVacaciones(`${apiUrl}/Vacacion/pendientes`, {
    method: "GET",
  });
}
