import { useQuery } from "@tanstack/react-query";
import { listarInventario } from "../inventario.logic";
import { ListarInventario, ListarInventarioRequest } from "../inventario.type";

export function useInventarios(params: ListarInventarioRequest) {
  const {
    data: response,
    isLoading: loading,
    error,
  } = useQuery<{
    inventario: ListarInventario[];
    totalRegistros: number;
  }>({
    queryKey: ["inventario", params],
    queryFn: () => listarInventario(params),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  return {
    inventario: response?.inventario ?? [],
    totalRegistros: response?.totalRegistros ?? 0,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}
