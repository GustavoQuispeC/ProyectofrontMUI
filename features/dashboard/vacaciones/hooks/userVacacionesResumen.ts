import { useQuery } from "@tanstack/react-query";
import { listarVacacionesResumen } from "../vacaciones.logic";

export function useVacacionesResumen(canAccess: boolean) {
  const {
    data: vacacionesResumen = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["vacacionesResumen"],
    queryFn: listarVacacionesResumen,
    staleTime: 0,
    refetchInterval: 1000 * 30, // cada 30 segundos
    refetchOnWindowFocus: true,
    retry: 1,
    enabled: canAccess,
  });

  return {
    vacacionesResumen,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}
