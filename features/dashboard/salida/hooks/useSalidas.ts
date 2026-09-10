import { useQuery } from "@tanstack/react-query";
import { listarSalidas } from "../salida.logic";
import { ListarSalida, ListarSalidasRequest } from "../salida.type";

export function useSalidas(params: ListarSalidasRequest) {
  const {
    data: response,
    isLoading: loading,
    error,
  } = useQuery<{
    salidas: ListarSalida[];
    totalRegistros: number;
  }>({
    queryKey: ["salidas", params],
    queryFn: () => listarSalidas(params),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  return {
    salidas: response?.salidas ?? [],
    totalRegistros: response?.totalRegistros ?? 0,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}
