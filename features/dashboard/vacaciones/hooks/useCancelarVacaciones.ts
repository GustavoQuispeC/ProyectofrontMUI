import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelarVacaciones } from "@/features/dashboard/vacaciones/vacaciones.logic";

export function useCancelarVacaciones(onSuccess?: () => void) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: cancelarVacaciones,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vacacionesAprobadas"] });
            queryClient.invalidateQueries({ queryKey: ["vacacionesPendientes"] });
            onSuccess?.();
        },
    });

    return {
        cancelarVacacion: mutation.mutate,
        loading: mutation.isPending,
        error: mutation.error?.message ?? null,
    };
}