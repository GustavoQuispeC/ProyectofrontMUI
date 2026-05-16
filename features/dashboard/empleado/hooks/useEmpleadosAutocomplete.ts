import { listarEmpleadosActivosApi } from "../empleado.service";
import { useQuery } from "@tanstack/react-query";

export function useEmpleadosAutocomplete() {
  const {
    data: empleados = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["empleados-autocomplete"],
    queryFn: listarEmpleadosActivosApi,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
  });

  return {
    empleados,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
