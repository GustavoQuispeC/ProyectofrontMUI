import { useQuery } from "@tanstack/react-query";
import { listarPermisosPendientesApi } from "../permiso.service";

export function usePermisosPendientes(canAccess: boolean) {
  const {
    data: permisosPendientes = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["permisosPendientes"],
    queryFn: listarPermisosPendientesApi,
    staleTime: 0,
    refetchInterval: 1000 * 30, // cada 30 segundos
    refetchOnWindowFocus: true,
    retry: 1,
    enabled: canAccess,
  });
  return {
    permisosPendientes,
    loading,
    error: error?.message || null,
    refetch,
  };
}
