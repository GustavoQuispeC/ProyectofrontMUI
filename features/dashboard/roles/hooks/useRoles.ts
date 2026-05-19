import { useQuery } from "@tanstack/react-query";
import { listarRolesApi } from "../roles.service";

export function useRoles() {
  const {
    data: roles = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: listarRolesApi,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
    enabled: true,
  });

  return {
    roles,
    loading,
    error: error?.message || null,
    refetch,
  };
}
