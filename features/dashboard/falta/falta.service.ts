import { apiFalta } from "@/lib/api-falta";
import { PendientesFaltas, RegistrarFalta } from "./falta.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//!Registrar falta
export async function registrarFaltaApi(data: RegistrarFalta): Promise<{ faltaId: number }> {
  return apiFalta<{ faltaId: number }>(`${apiUrl}/faltas`, { method: "POST", body: JSON.stringify(data) });
}

//!Listar faltas pendientes
export async function listarFaltasPendientesApi(): Promise<PendientesFaltas[]> {
  return apiFalta<PendientesFaltas[]>(`${apiUrl}/faltas/pendientes`, {
    method: "GET",
  });
}
