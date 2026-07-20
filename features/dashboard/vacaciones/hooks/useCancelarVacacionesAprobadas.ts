import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelarVacacionesAprobadas } from "@/features/dashboard/vacaciones/vacaciones.logic";

export function useCancelarVacacionesAprobadas(
  onSuccess?: (mensaje?: string) => void,
  onError?: (mensaje: string) => void,
) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: cancelarVacacionesAprobadas,
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
    cancelarVacacionAprobada: mutation.mutate,
    loading: mutation.isPending,
  };
}
