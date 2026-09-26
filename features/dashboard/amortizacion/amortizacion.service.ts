import dayjs from "dayjs";
import { apiVenta } from "@/lib/api-venta";
import { getAuthUser } from "@/shared/auth/auth.service";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  AmortizarClienteRequest,
  AmortizarVentaRequest,
  ListarVentasCreditoRequest,
  ListarVentasCreditoResponse,
  ReporteDeudasPdfRequest,
  VentaCredito,
} from "./amortizacion.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function listarVentasCreditoApi(params: ListarVentasCreditoRequest): Promise<{
  ventas: VentaCredito[];
  totalRegistros: number;
}> {
  const searchParams = new URLSearchParams();

  searchParams.set("pagina", String(params.pagina || 1));
  searchParams.set("tamanoPagina", String(params.tamanoPagina || 50));

  if (params.tiendaId) searchParams.set("tiendaId", String(params.tiendaId));
  if (params.clienteId) searchParams.set("clienteId", String(params.clienteId));
  if (params.estadoPago) searchParams.set("estadoPago", String(params.estadoPago));
  if (params.fechaDesde) {
    searchParams.set("fechaDesde", dayjs(params.fechaDesde).startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS"));
  }
  if (params.fechaHasta) {
    searchParams.set("fechaHasta", dayjs(params.fechaHasta).endOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS"));
  }

  const query = searchParams.toString();
  const response = await apiVenta(`${apiUrl}/venta/credito${query ? `?${query}` : ""}`, { method: "GET" });

  if (Array.isArray(response)) {
    return { ventas: response as VentaCredito[], totalRegistros: response.length };
  }

  const data = response as Partial<ListarVentasCreditoResponse> | null;
  const ventas = data?.items ?? [];

  return { ventas, totalRegistros: data?.totalCount ?? ventas.length };
}

export function amortizarVentaApi(ventaId: number, data: AmortizarVentaRequest): Promise<VentaCredito | null> {
  return apiVenta(`${apiUrl}/amortizacion/venta/${ventaId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function amortizarClienteApi(clienteId: number, data: AmortizarClienteRequest): Promise<unknown> {
  return apiVenta(`${apiUrl}/amortizacion/cliente/${clienteId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

//! Descargar reporte de deudas en PDF
export async function descargarReporteDeudasPdfApi(
  params: ReporteDeudasPdfRequest,
  filename = "reporte-deudas.pdf",
): Promise<void> {
  const searchParams = new URLSearchParams();

  if (params.clienteNombreORazonSocial?.trim()) {
    searchParams.set("clienteNombreORazonSocial", params.clienteNombreORazonSocial.trim());
  }
  if (params.tiendaId) searchParams.set("tiendaId", String(params.tiendaId));
  if (params.fechaDesde) {
    searchParams.set("fechaDesde", dayjs(params.fechaDesde).startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS"));
  }
  if (params.fechaHasta) {
    searchParams.set("fechaHasta", dayjs(params.fechaHasta).endOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS"));
  }

  const auth = getAuthUser();
  const response = await fetch(`${apiUrl}/venta/reporte-deudas-pdf?${searchParams.toString()}`, {
    method: "GET",
    headers: auth?.token ? { Authorization: `Bearer ${auth.token}` } : {},
  });

  if (response.status === 401) {
    window.location.href = "/";
    throw new Error("Sesión expirada");
  }

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
