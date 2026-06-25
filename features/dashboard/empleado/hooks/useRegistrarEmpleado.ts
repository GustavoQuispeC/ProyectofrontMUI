import {useMutation, useQueryClient} from "@tanstack/react-query";
import {registrarEmpleado} from "@/features/dashboard/empleado/empleado.logic";
import {RegistrarEmpleadoRequest} from "@/features/dashboard/empleado/empleado.types";


export function useRegistrarEmpleado() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: RegistrarEmpleadoRequest) =>
            registrarEmpleado(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["empleados"],
            });
            queryClient.invalidateQueries({
                queryKey: ["empleados-autocomplete"],
            });
        },
    });
}