import { apiCajaSesion } from "@/lib/api-cajasesion";
import { AbrirCajaSesionRequest, CerrarCajaSesionRequest, CajaSesion } from "./caja.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Abrir caja
export function abrirCajaSesionApi(data: AbrirCajaSesionRequest): Promise<CajaSesion> {
  return apiCajaSesion(`${apiUrl}/cajasesion/abrir`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

//! Cerrar caja
export function cerrarCajaSesionApi(data: CerrarCajaSesionRequest): Promise<CajaSesion> {
  return apiCajaSesion(`${apiUrl}/cajasesion/cerrar`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

//! Obtener sesión por id
export function obtenerCajaSesionApi(id: number): Promise<CajaSesion | null> {
  return apiCajaSesion(`${apiUrl}/cajasesion/${id}`, {
    method: "GET",
  });
}

//! Obtener sesión abierta de una tienda
export function obtenerCajaSesionActivaApi(tiendaId: number): Promise<CajaSesion | null> {
  return apiCajaSesion(`${apiUrl}/cajasesion/activa/${tiendaId}`, {
    method: "GET",
  });
}

//! Historial de sesiones de una tienda
export function listarCajaSesionesPorTiendaApi(tiendaId: number): Promise<CajaSesion[]> {
  return apiCajaSesion(`${apiUrl}/cajasesion/tienda/${tiendaId}`, {
    method: "GET",
  });
}
