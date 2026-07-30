import { useQuery } from "@tanstack/react-query";
import { listarUnidadesMedida } from "../unidadMedida.logic";
import { ListarUnidadMedida } from "../UnidadMedida.types";

export function useUnidadesMedida(canAccess: boolean) {
  const {
    data: unidadesMedida = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ListarUnidadMedida[]>({
    queryKey: ["unidadesMedida"],

    queryFn: listarUnidadesMedida,

    staleTime: 1000 * 60 * 5,

    retry: 1,

    enabled: canAccess,
  });

  return {
    unidadesMedida,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
