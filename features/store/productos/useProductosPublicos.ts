import { useQuery } from "@tanstack/react-query";
import { obtenerProductosPublicosApi } from "./productosPublicos.service";
import { ListarProductosRequest, ProductosResponse } from "@/features/dashboard/producto/Producto.types";

export function useProductosPublicos(params: ListarProductosRequest, enabled = true) {
  const {
    data: response,
    isLoading: loading,
    error,
  } = useQuery<ProductosResponse>({
    queryKey: ["productos-publicos", params],
    queryFn: () => obtenerProductosPublicosApi(params),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled,
  });

  return {
    productos: response?.productos ?? [],
    paginacion: response?.paginacion,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}
