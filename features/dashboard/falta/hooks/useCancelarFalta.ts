import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelarFaltaApi } from "../falta.service";

export function useCancelarFalta() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => cancelarFaltaApi(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["faltas"],
      });

      queryClient.invalidateQueries({
        queryKey: ["faltasPendientes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["faltasMensuales"],
      });
    },
  });

  return {
    cancelarFalta: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
