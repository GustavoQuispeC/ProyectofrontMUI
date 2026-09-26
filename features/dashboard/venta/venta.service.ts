import { apiVenta } from "@/lib/api-venta";
import { ListarVentasRequest, ListarVentasResponse, RegistrarVentaRequest, VentaRegistrada } from "./venta.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Listar ventas (por defecto: ventas del día actual, más recientes primero)
export async function listarVentasApi(params: ListarVentasRequest): Promise<{
  ventas: ListarVentasResponse["items"];
  totalRegistros: number;
}> {
  const searchParams = new URLSearchParams();

  searchParams.set("pagina", String(params.pagina || 1));
  searchParams.set("tamanoPagina", String(params.tamanoPagina || 20));

  if (params.tiendaId) searchParams.set("tiendaId", String(params.tiendaId));
  if (params.clienteId) searchParams.set("clienteId", String(params.clienteId));
  if (params.usuarioId) searchParams.set("usuarioId", params.usuarioId);
  if (params.codigo) searchParams.set("codigo", params.codigo);
  if (params.estado) searchParams.set("estado", String(params.estado));
  if (params.estadoPago) searchParams.set("estadoPago", String(params.estadoPago));
  if (params.tipoPago) searchParams.set("tipoPago", String(params.tipoPago));
  if (params.fechaDesde) searchParams.set("fechaDesde", params.fechaDesde);
  if (params.fechaHasta) searchParams.set("fechaHasta", params.fechaHasta);

  const query = searchParams.toString();
  const response = await apiVenta(`${apiUrl}/venta${query ? `?${query}` : ""}`, {
    method: "GET",
  });

  if (Array.isArray(response)) {
    return { ventas: response, totalRegistros: response.length };
  }

  const data = response as Partial<ListarVentasResponse> | null;
  const ventas = data?.items ?? [];
  const totalRegistros = data?.totalCount ?? ventas.length;

  return { ventas, totalRegistros };
}

//! Obtener venta por id
export function obtenerVentaApi(id: number): Promise<VentaRegistrada> {
  return apiVenta(`${apiUrl}/ventas/${id}`, {
    method: "GET",
  });
}

//! Registrar venta
export function registrarVentaApi(data: RegistrarVentaRequest): Promise<VentaRegistrada> {
  return apiVenta(`${apiUrl}/venta`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
