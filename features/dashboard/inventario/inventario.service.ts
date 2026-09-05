import { apiInventario } from "@/lib/api-inventario";
import { InventarioAutocompleteItem, ListarInventario, ListarInventarioRequest } from "./inventario.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Autocomplete de inventario por tienda
export async function inventarioAutocompleteApi(
  tiendaId: number,
  busqueda?: string,
): Promise<InventarioAutocompleteItem[]> {
  const searchParams = new URLSearchParams();

  searchParams.set("tiendaId", String(tiendaId));
  if (busqueda) searchParams.set("busqueda", busqueda);

  const query = searchParams.toString();
  return apiInventario<InventarioAutocompleteItem[]>(`${apiUrl}/inventario/autocomplete${query ? `?${query}` : ""}`, {
    method: "GET",
  });
}

//! Listar inventario
export async function listarInventarioApi(params: ListarInventarioRequest): Promise<{
  inventario: ListarInventario[];
  totalRegistros: number;
}> {
  const searchParams = new URLSearchParams();

  searchParams.set("pagina", String(params.pagina || 1));
  searchParams.set("tamanoPagina", String(params.tamanoPagina || 20));

  if (params.tiendaId) searchParams.set("tiendaId", String(params.tiendaId));
  if (params.busquedaProducto) searchParams.set("busquedaProducto", params.busquedaProducto);
  if (params.fechaDesde) searchParams.set("fechaDesde", params.fechaDesde);
  if (params.fechaHasta) searchParams.set("fechaHasta", params.fechaHasta);

  const query = searchParams.toString();
  const response = await apiInventario<unknown>(`${apiUrl}/inventario${query ? `?${query}` : ""}`, {
    method: "GET",
  });

  if (Array.isArray(response)) {
    return { inventario: response as ListarInventario[], totalRegistros: response.length };
  }

  const data = response as Record<string, unknown> | null;
  const inventario = (data?.items ?? data?.inventario ?? data?.data ?? []) as ListarInventario[];
  const totalRegistros =
    (typeof data?.totalCount === "number" && data.totalCount) ||
    (typeof data?.totalRegistros === "number" && data.totalRegistros) ||
    (typeof data?.total === "number" && data.total) ||
    inventario.length;

  return { inventario, totalRegistros };
}
