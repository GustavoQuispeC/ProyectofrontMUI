import { useQuery } from "@tanstack/react-query";
import { listarUsuariosApi } from "../usuario.service";

export function useUsuarios(canAccess: boolean) {
  const {
    data: usuarios = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["usuarios"],

    queryFn: listarUsuariosApi,

    staleTime: 1000 * 60 * 5,

    retry: 1,

    enabled: canAccess,
  });

  return {
    usuarios,
    loading,
    error: error?.message || null,
    refetch,
  };
}
