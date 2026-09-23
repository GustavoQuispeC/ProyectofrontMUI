import dayjs from "dayjs";
import { apiVenta } from "@/lib/api-venta";
import {
  AmortizarClienteRequest,
  AmortizarVentaRequest,
  ListarVentasCreditoRequest,
  ListarVentasCreditoResponse,
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
    searchParams.set("fechaDesde", dayjs(params.fechaDesde).startOf("day").toISOString());
  }
  if (params.fechaHasta) {
    searchParams.set("fechaHasta", dayjs(params.fechaHasta).endOf("day").toISOString());
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
