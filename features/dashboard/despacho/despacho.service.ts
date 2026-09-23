import { apiDespacho } from "@/lib/api-despacho";
import { AsignarConductorVehiculoRequest, ConductorDespacho, Despacho, EnRutaRequest } from "./despacho.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function listarDespachosPorVentaApi(ventaId: number): Promise<Despacho[]> {
  return apiDespacho(`${apiUrl}/despachos/venta/${ventaId}`, { method: "GET" });
}

export function listarConductoresDespachoApi(): Promise<ConductorDespacho[]> {
  return apiDespacho(`${apiUrl}/despachos/conductores`, { method: "GET" });
}

export function asignarConductorVehiculoApi(
  id: number,
  data: AsignarConductorVehiculoRequest,
): Promise<Despacho | null> {
  return apiDespacho(`${apiUrl}/despachos/${id}/asignar-conductor-vehiculo`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function marcarDespachoEnRutaApi(id: number, data?: EnRutaRequest): Promise<Despacho | null> {
  return apiDespacho(`${apiUrl}/despachos/${id}/en-ruta`, {
    method: "PUT",
    body: data ? JSON.stringify(data) : null,
  });
}

export function despacharEnTiendaApi(id: number, data: EnRutaRequest): Promise<Despacho | null> {
  return apiDespacho(`${apiUrl}/despachos/${id}/despachar`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function completarDespachoApi(id: number): Promise<Despacho | null> {
  return apiDespacho(`${apiUrl}/despachos/${id}/completar`, { method: "PUT" });
}
