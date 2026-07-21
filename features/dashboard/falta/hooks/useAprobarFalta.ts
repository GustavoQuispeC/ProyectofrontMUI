import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aprobarFaltaApi } from "../falta.service";

export function useAprobarFalta() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => aprobarFaltaApi(id),

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
    aprobarFalta: mutation.mutate,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
