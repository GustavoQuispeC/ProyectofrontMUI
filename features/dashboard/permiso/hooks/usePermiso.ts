import { useQuery } from "@tanstack/react-query";
import { listarPermisosApi } from "../permiso.service";

export function usePermisos(canAccess: boolean, empleadoId: number, anio: string, mes: string) {
  const {
    data: permisos = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["permisos", empleadoId, anio, mes],

    queryFn: () => listarPermisosApi(empleadoId, anio, mes),

    staleTime: 1000 * 60 * 5,

    retry: 1,

    enabled: canAccess,
  });

  return {
    permisos,
    loading,
    error: error?.message || null,
    refetch,
  };
}
