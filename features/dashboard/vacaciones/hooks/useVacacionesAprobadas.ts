import { useQuery } from "@tanstack/react-query";
import { listarVacacionesGenerales } from "../vacaciones.logic";

export function useVacacionesAprobadas(canAccess: boolean) {
  const {
    data: vacacionesGenerales = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["vacacionesGenerales"],
    queryFn: () => listarVacacionesGenerales(),
    staleTime: 0,
    refetchInterval: 1000 * 30, // cada 30 segundos
    refetchOnWindowFocus: true,
    retry: 1,
    enabled: canAccess,
  });

  return {
    vacacionesGenerales,
    loading,
    error: error?.message || null,
    refetch,
  };
}
