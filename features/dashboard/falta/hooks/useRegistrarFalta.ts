import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registrarFalta } from "../falta.logic";
import { RegistrarFalta } from "../falta.constants";

export function useRegistrarFalta() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: RegistrarFalta) => registrarFalta(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faltas"] });
      queryClient.invalidateQueries({ queryKey: ["faltasPendientes"] });
    },
  });

  return {
    registrarFalta: mutation.mutate,
    registrarFaltaAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
