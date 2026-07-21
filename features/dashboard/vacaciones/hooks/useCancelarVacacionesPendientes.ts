import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelarVacacionesPendientes } from "@/features/dashboard/vacaciones/vacaciones.logic";

export function useCancelarVacacionesPendientes(
  onSuccess?: (mensaje?: string) => void,
  onError?: (mensaje: string) => void,
) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: cancelarVacacionesPendientes,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vacacionesAprobadas"] });
      queryClient.invalidateQueries({ queryKey: ["vacacionesPendientes"] });
      onSuccess?.(data?.mensaje);
    },
    onError: (error: Error) => {
      onError?.(error.message);
    },
  });

  return {
    cancelarVacacionesPendientes: mutation.mutate,
    loading: mutation.isPending,
  };
}
