import { apiFalta } from "@/lib/api-falta";
import { ListarFaltaMensual, PendientesFaltas, RegistrarFalta } from "./falta.type";

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

//! Aprobar faltas
export async function aprobarFaltaApi(faltaId: number): Promise<void> {
  return apiFalta<void>(`${apiUrl}/faltas/${faltaId}/aprobar`, {
    method: "PUT",
  });
}

//!Cancelar falta
export async function cancelarFaltaApi(faltaId: number): Promise<void> {
  return apiFalta<void>(`${apiUrl}/faltas/${faltaId}/cancelar`, {
    method: "PUT",
  });
}

//! Listar falta mensual
export async function listarFaltaMensualApi(anio: number, mes: number): Promise<ListarFaltaMensual[]> {
  return apiFalta<ListarFaltaMensual[]>(`${apiUrl}/faltas/reporte-mensual?anio=${anio}&mes=${mes}`, {
    method: "GET",
  });
}
