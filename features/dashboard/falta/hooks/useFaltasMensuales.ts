import { useQuery } from "@tanstack/react-query";
import { listarFaltaMensualApi } from "../falta.service";

export function useFaltasMensuales(canAccess: boolean, anio: number, mes: number) {
  const {
    data: faltasMensuales = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["faltasMensuales", anio, mes],
    queryFn: () => listarFaltaMensualApi(anio, mes),
    staleTime: 0,
    refetchInterval: 1000 * 30, // cada 30 segundos
    refetchOnWindowFocus: true,
    retry: 1,
    enabled: canAccess && anio > 0 && mes > 0,
  });

  return {
    faltasMensuales,
    loading,
    error: error?.message || null,
    refetch,
  };
}
