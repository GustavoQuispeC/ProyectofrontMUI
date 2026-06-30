import { useQuery } from "@tanstack/react-query";
export function useActualizarUsuario(canAccess: boolean) {
  const {
    data: usuarios = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["usuarios"],
    queryFn: () => Promise.resolve([]),
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
