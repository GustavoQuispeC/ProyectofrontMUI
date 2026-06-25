import {useQuery} from "@tanstack/react-query";
import {DetalleEmpleadoResponse} from "@/features/dashboard/empleado/empleado.types";
import {obtenerDetalleEmpleadoApi} from "@/features/dashboard/empleado/empleado.service";

export function useEmpleado(id: number, canAccess: boolean) {
    const query = useQuery<DetalleEmpleadoResponse>({
        queryKey: ["empleado", id],
        queryFn: () => obtenerDetalleEmpleadoApi(id),
        enabled: id > 0 && canAccess,
        staleTime: 5 * 60 * 1000,
    });

    return {
        empleado: query.data,
        loading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
}
