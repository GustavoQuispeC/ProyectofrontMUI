import {useMutation, useQueryClient} from "@tanstack/react-query";
import {aprobarVacacionesApi} from "@/features/dashboard/vacaciones/vacaciones.service";

export function useAprobarVacaciones(onSuccess?: () => void) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: aprobarVacacionesApi,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["vacaciones"]});
            queryClient.invalidateQueries({queryKey: ["vacacionesPendientes"]});
            onSuccess?.();
        },
    });

    return {
        aprobarVacaciones: mutation.mutate,
        loading: mutation.isPending,
        error: mutation.error,
    };
}