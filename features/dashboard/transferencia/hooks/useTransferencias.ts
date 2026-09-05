import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listarTransferencias, registrarTransferencia } from "../transferencia.logic";
import { ListarTransferencia, ListarTransferenciasRequest, RegistrarTransferencia } from "../transferencia.type";

export function useTransferencias(params: ListarTransferenciasRequest) {
  const {
    data: response,
    isLoading: loading,
    error,
  } = useQuery<{
    transferencias: ListarTransferencia[];
    totalRegistros: number;
  }>({
    queryKey: ["transferencias", params],
    queryFn: () => listarTransferencias(params),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  return {
    transferencias: response?.transferencias ?? [],
    totalRegistros: response?.totalRegistros ?? 0,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}

export function useRegistrarTransferencia() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: RegistrarTransferencia) => registrarTransferencia(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transferencias"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-autocomplete"] });
    },
  });

  return {
    registrarTransferencia: mutation.mutate,
    registrarTransferenciaAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
