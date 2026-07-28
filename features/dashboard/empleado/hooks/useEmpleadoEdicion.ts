import { useQuery } from "@tanstack/react-query";
import { obtenerEmpleadoEdicionApi } from "../empleado.service";

export function useEmpleadoEdicion(id: string, enabled = true) {
  const {
    data: empleado = null,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["empleado-edicion", id],
    queryFn: () => obtenerEmpleadoEdicionApi(id),
    enabled: enabled && !!id,
    staleTime: 0,
    retry: 1,
  });

  return {
    empleado,
    loading,
    error: error?.message || null,
  };
}
