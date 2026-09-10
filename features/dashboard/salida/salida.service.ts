import { apiCliente } from "@/lib/api-cliente";
import { CrearSalidaRequest, ListarSalida, ListarSalidasRequest, Salida } from "./salida.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Crear nueva salida de productos
export async function crearSalidaApi(payload: CrearSalidaRequest): Promise<Salida> {
  const response = await apiCliente(`${apiUrl}/salidas`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response as Salida;
}

//! Listar salidas paginadas
export async function listarSalidasApi(params: ListarSalidasRequest): Promise<{
  salidas: ListarSalida[];
  totalRegistros: number;
}> {
  const searchParams = new URLSearchParams();

  searchParams.set("pagina", String(params.pagina || 1));
  searchParams.set("tamanoPagina", String(params.tamanoPagina || 20));

  if (params.tiendaOrigenId) searchParams.set("tiendaOrigenId", String(params.tiendaOrigenId));
  if (params.origen) searchParams.set("origen", String(params.origen));
  if (params.fechaDesde) searchParams.set("fechaDesde", params.fechaDesde);
  if (params.fechaHasta) searchParams.set("fechaHasta", params.fechaHasta);

  const query = searchParams.toString();
  const response = await apiCliente(`${apiUrl}/salidas${query ? `?${query}` : ""}`, {
    method: "GET",
  });

  const data = response as Record<string, unknown> | null;
  const salidas = (data?.items ?? []) as ListarSalida[];
  const totalRegistros = (typeof data?.totalCount === "number" && data.totalCount) || salidas.length;

  return { salidas, totalRegistros };
}
