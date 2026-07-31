import { useQuery } from "@tanstack/react-query";
import { listarCategorias } from "../categoria.logic";
import { ListarCategoria } from "../Categoria.types";

export function useCategorias(canAccess: boolean) {
  const {
    data: categorias = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ListarCategoria[]>({
    queryKey: ["categorias"],

    queryFn: listarCategorias,

    staleTime: 1000 * 60 * 5,

    retry: 1,

    enabled: canAccess,
  });

  return {
    categorias,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
