import { useQuery } from "@tanstack/react-query";
import { getUsuarioByIdApi } from "../usuario.service";

export function useUsuarioById(userId: string | null) {
  const {
    data: usuario,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["usuario", userId],
    queryFn: () => getUsuarioByIdApi(userId!),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: !!userId,
  });

  return {
    usuario,
    loading,
    error: error?.message || null,
  };
}
