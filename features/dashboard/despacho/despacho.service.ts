import { apiDespacho } from "@/lib/api-despacho";
import { getApiErrorMessage } from "@/lib/api-error";
import { getAuthUser, logout } from "@/shared/auth/auth.service";
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

async function descargarPdfDespachoApi(endpoint: string, filename: string): Promise<void> {
  const auth = getAuthUser();
  const response = await fetch(endpoint, {
    method: "GET",
    headers: auth?.token ? { Authorization: `Bearer ${auth.token}` } : {},
  });

  if (response.status === 401) {
    logout();
    window.location.href = "/";
    throw new Error("Sesión expirada");
  }

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/pdf")) {
    const message = await response.text();
    throw new Error(message || "El servidor no devolvió un archivo PDF");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function descargarPdfRecojoTiendaApi(id: number, filename: string): Promise<void> {
  return descargarPdfDespachoApi(`${apiUrl}/despachos/${id}/pdf-recojo-tienda`, filename);
}

export function descargarPdfEnvioDomicilioApi(id: number, filename: string): Promise<void> {
  return descargarPdfDespachoApi(`${apiUrl}/despachos/${id}/pdf-envio-domicilio`, filename);
}
