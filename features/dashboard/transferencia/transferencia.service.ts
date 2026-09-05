import { apiTransferencia } from "@/lib/api-tranferencia";
import {
  ListarTransferencia,
  ListarTransferenciasRequest,
  RegistrarTransferencia,
  TransferenciaRegistrada,
} from "./transferencia.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Listar transferencias
export async function listarTransferenciasApi(params: ListarTransferenciasRequest): Promise<{
  transferencias: ListarTransferencia[];
  totalRegistros: number;
}> {
  const searchParams = new URLSearchParams();

  searchParams.set("pagina", String(params.pagina || 1));
  searchParams.set("tamanoPagina", String(params.tamanoPagina || 20));

  if (params.tiendaOrigenId) searchParams.set("tiendaOrigenId", String(params.tiendaOrigenId));
  if (params.tiendaDestinoId) searchParams.set("tiendaDestinoId", String(params.tiendaDestinoId));
  if (params.fechaDesde) searchParams.set("fechaDesde", params.fechaDesde);
  if (params.fechaHasta) searchParams.set("fechaHasta", params.fechaHasta);
  if (params.busquedaProducto) searchParams.set("busquedaProducto", params.busquedaProducto);

  const query = searchParams.toString();
  const response = await apiTransferencia<unknown>(`${apiUrl}/transferencias${query ? `?${query}` : ""}`, {
    method: "GET",
  });

  if (Array.isArray(response)) {
    return { transferencias: response as ListarTransferencia[], totalRegistros: response.length };
  }

  const data = response as Record<string, unknown> | null;
  const transferencias = (data?.items ?? data?.transferencias ?? data?.data ?? []) as ListarTransferencia[];
  const totalRegistros =
    (typeof data?.totalCount === "number" && data.totalCount) ||
    (typeof data?.totalRegistros === "number" && data.totalRegistros) ||
    (typeof data?.total === "number" && data.total) ||
    transferencias.length;

  return { transferencias, totalRegistros };
}

//! Registrar transferencia
export async function registrarTransferenciaApi(data: RegistrarTransferencia): Promise<TransferenciaRegistrada> {
  return apiTransferencia<TransferenciaRegistrada>(`${apiUrl}/transferencias`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
