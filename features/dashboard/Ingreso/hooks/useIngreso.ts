import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listarIngresos, registrarIngreso } from "../ingreso.logic";
import { ListarIngreso, ListarIngresosRequest, RegistrarIngreso } from "../ingreso.type";

export function useIngresos(params: ListarIngresosRequest) {
  const {
    data: response,
    isLoading: loading,
    error,
  } = useQuery<{
    ingresos: ListarIngreso[];
    totalRegistros: number;
  }>({
    queryKey: ["ingresos", params],
    queryFn: () => listarIngresos(params),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  return {
    ingresos: response?.ingresos ?? [],
    totalRegistros: response?.totalRegistros ?? 0,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}

export function useRegistrarIngreso() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: RegistrarIngreso) => registrarIngreso(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingresos"] });
    },
  });

  return {
    registrarIngreso: mutation.mutate,
    registrarIngresoAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
