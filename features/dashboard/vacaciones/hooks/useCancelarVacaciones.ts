import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelarVacaciones } from "@/features/dashboard/vacaciones/vacaciones.logic";

export function useCancelarVacaciones(
  onSuccess?: (mensaje?: string) => void,
  onError?: (mensaje: string) => void,
) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: cancelarVacaciones,
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
    cancelarVacacion: mutation.mutate,
    loading: mutation.isPending,
  };
}
