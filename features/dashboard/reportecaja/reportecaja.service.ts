import dayjs from "dayjs";
import { apiReporteCaja } from "@/lib/api-reportecaja";
import { ListarReporteCajaPagosRequest, ListarReporteCajaPagosResponse } from "./reportecaja.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function listarReporteCajaPagosApi(
  params: ListarReporteCajaPagosRequest,
): Promise<ListarReporteCajaPagosResponse> {
  const searchParams = new URLSearchParams();

  searchParams.set("pagina", String(params.pagina || 1));
  searchParams.set("tamanoPagina", String(params.tamanoPagina || 50));

  if (params.tiendaId) searchParams.set("tiendaId", String(params.tiendaId));
  if (params.cajaSesionId) searchParams.set("cajaSesionId", String(params.cajaSesionId));
  if (params.clienteId) searchParams.set("clienteId", String(params.clienteId));
  if (params.formaPago) searchParams.set("formaPago", String(params.formaPago));
  if (params.fechaDesde) {
    searchParams.set("fechaDesde", dayjs(params.fechaDesde).startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS"));
  }
  if (params.fechaHasta) {
    searchParams.set("fechaHasta", dayjs(params.fechaHasta).endOf("day").format("YYYY-MM-DDTHH:mm:ss.SSS"));
  }

  const query = searchParams.toString();
  return apiReporteCaja(`${apiUrl}/reportecaja/pagos${query ? `?${query}` : ""}`, {
    method: "GET",
  });
}
