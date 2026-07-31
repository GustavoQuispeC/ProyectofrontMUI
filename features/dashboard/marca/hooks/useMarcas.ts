import { useQuery } from "@tanstack/react-query";
import { listarMarcas } from "../marca.logic";
import { ListarMarca } from "../Marca.types";

export function useMarcas(canAccess: boolean) {
  const {
    data: marcas = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ListarMarca[]>({
    queryKey: ["marcas"],

    queryFn: listarMarcas,

    staleTime: 1000 * 60 * 5,

    retry: 1,

    enabled: canAccess,
  });

  return {
    marcas,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
