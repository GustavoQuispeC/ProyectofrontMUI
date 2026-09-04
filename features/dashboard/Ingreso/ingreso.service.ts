import { apiIngreso } from "@/lib/api-ingreso";
import { IngresoRegistrado, ListarIngreso, ListarIngresosRequest, RegistrarIngreso } from "./ingreso.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Listar ingresos
export async function listarIngresosApi(params: ListarIngresosRequest): Promise<{
  ingresos: ListarIngreso[];
  totalRegistros: number;
}> {
  const searchParams = new URLSearchParams();

  searchParams.set("pagina", String(params.pagina || 1));
  searchParams.set("tamanoPagina", String(params.tamanoPagina || 20));

  if (params.tiendaId) searchParams.set("tiendaId", String(params.tiendaId));
  if (params.fechaDesde) searchParams.set("fechaDesde", params.fechaDesde);
  if (params.fechaHasta) searchParams.set("fechaHasta", params.fechaHasta);
  if (params.busquedaProducto) searchParams.set("busquedaProducto", params.busquedaProducto);

  const query = searchParams.toString();
  const response = await apiIngreso<unknown>(`${apiUrl}/ingresos${query ? `?${query}` : ""}`, {
    method: "GET",
  });

  if (Array.isArray(response)) {
    return { ingresos: response as ListarIngreso[], totalRegistros: response.length };
  }

  const data = response as Record<string, unknown> | null;
  const ingresos = (data?.items ?? data?.ingresos ?? data?.data ?? []) as ListarIngreso[];
  const totalRegistros =
    (typeof data?.totalCount === "number" && data.totalCount) ||
    (typeof data?.totalRegistros === "number" && data.totalRegistros) ||
    (typeof data?.total === "number" && data.total) ||
    ingresos.length;

  return { ingresos, totalRegistros };
}

//! Registrar ingreso
export async function registrarIngresoApi(data: RegistrarIngreso): Promise<IngresoRegistrado> {
  return apiIngreso<IngresoRegistrado>(`${apiUrl}/ingresos`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
