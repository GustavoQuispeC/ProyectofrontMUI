import { listarEmpleadosApi } from "../empleado.service";
import { useQuery } from "@tanstack/react-query";

export function useEmpleados() {
  const {
    data: empleados = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["empleados"],
    queryFn: listarEmpleadosApi,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
    enabled: true,
  });

  return {
    empleados,
    loading,
    error: error?.message || null,
    refetch,
  };
}
