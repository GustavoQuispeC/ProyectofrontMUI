import { useQuery } from "@tanstack/react-query";
import { listarVacacionesById } from "../vacaciones.logic";

export function useVacacionesIdResumen(guid: string | null, canAccess: boolean) {
  const {
    data: vacacionesDetalle,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["vacacionesDetalle", guid],
    queryFn: () => listarVacacionesById(guid!),
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: 1,
    enabled: canAccess && !!guid,
  });

  return {
    vacacionesDetalle,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}
