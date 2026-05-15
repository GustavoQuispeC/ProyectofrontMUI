import { useQuery } from "@tanstack/react-query";
import { listarUsuariosApi } from "../usuario.service";

export function useUsuarios() {
  const {
    data: usuarios = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["usuarios"],
    queryFn: listarUsuariosApi,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
    enabled: true,
  });

  return {
    usuarios,
    loading,
    error: error?.message || null,
    refetch,
  };
}
