import { DetalleEmpleado } from "../empleado.types";
import { detalleEmpleadoApi } from "../empleado.service";
import { useQuery } from "@tanstack/react-query";

export function useEmpleado(id: string, canAccess: boolean) {
  const {
    data: empleado,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<DetalleEmpleado>({
    queryKey: ["empleado", id],

    queryFn: () => detalleEmpleadoApi(id),

    enabled: !!id && canAccess,

    staleTime: 1000 * 60 * 5,
  });

  return {
    empleado,
    loading,
    error: error ? "Error al cargar empleado" : null,
    refetch,
  };
}
