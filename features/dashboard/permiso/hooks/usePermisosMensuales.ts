import { useQuery } from "@tanstack/react-query";
import { listarPermisosMensualApi } from "../permiso.service";

export function usePermisosMensuales(canAccess: boolean, anio: number, mes: number) {
  const {
    data: permisosMensuales = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["permisosMensuales", anio, mes],

    queryFn: () => listarPermisosMensualApi(anio, mes),

    staleTime: 1000 * 60 * 5,

    retry: 1,

    enabled: canAccess && anio > 0 && mes > 0,
  });

  return {
    permisosMensuales,
    loading,
    error: error?.message || null,
    refetch,
  };
}
