import { useQuery } from "@tanstack/react-query";
import { listarFaltasPendientes } from "../falta.logic";

export function useFaltasPendientes(canAccess: boolean) {
  const {
    data: faltasPendientes = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["faltasPendientes"],
    queryFn: listarFaltasPendientes,
    staleTime: 0,
    refetchInterval: 1000 * 30,
    refetchOnWindowFocus: true,
    retry: 1,
    enabled: canAccess,
  });

  return {
    faltasPendientes,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}
