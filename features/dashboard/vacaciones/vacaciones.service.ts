import { apiVacaciones } from "@/lib/api-vacaciones";
import { ListarEmpleadoVacaciones, RegistrarVacaciones } from "./vacaciones.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Listar vacaciones
export async function listarVacacionesApi(): Promise<ListarEmpleadoVacaciones[]> {
  return apiVacaciones(`${apiUrl}/Vacacion/reporte-general`, {
    method: "GET",
  });
}

//!Registrar Vacaciones
export async function registrarVacacionesApi(data: RegistrarVacaciones): Promise<{ vacacionId: number }> {
  return apiVacaciones<{ vacacionId: number }>(`${apiUrl}/Vacacion`, { method: "POST", body: JSON.stringify(data) });
}
