import { apiVacaciones } from "@/lib/api-vacaciones";
import { ListarEmpleadoVacaciones } from "./vacaciones.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Listar vacaciones
export async function listarVacacionesApi(): Promise<ListarEmpleadoVacaciones[]> {
  return apiVacaciones(`${apiUrl}/Vacacion/reporte-general`, {
    method: "GET",
  });
}
