import { apiProducto } from "@/lib/api-producto";
import { ListarProductosRequest, ProductosResponse } from "@/features/dashboard/producto/Producto.types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function obtenerProductosPublicosApi(params: ListarProductosRequest): Promise<ProductosResponse> {
  const query = new URLSearchParams();

  query.append("pagina", String(params.pagina));
  query.append("tamanoPagina", String(params.tamanoPagina));

  if (params.busqueda) query.append("busqueda", params.busqueda);
  if (params.categoriaId) query.append("categoriaId", String(params.categoriaId));
  if (params.marcaId) query.append("marcaId", String(params.marcaId));
  if (params.unidadMedidaId) query.append("unidadMedidaId", String(params.unidadMedidaId));
  if (params.isActive !== undefined) query.append("isActive", String(params.isActive));
  if (params.ordenarPor) query.append("ordenarPor", params.ordenarPor);
  if (params.ordenamiento) query.append("ordenamiento", params.ordenamiento);

  return apiProducto(`${apiUrl}/productos?${query.toString()}`, {
    method: "GET",
  });
}
