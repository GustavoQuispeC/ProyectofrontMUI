import { useQuery } from "@tanstack/react-query";
import { listarClientes } from "@/features/dashboard/cliente/cliente.logic";
import { ListarClientesRequest } from "@/features/dashboard/cliente/cliente.type";

export function useClientesListado(params: ListarClientesRequest) {
  const {
    data: response,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<{
    clientes: import("@/features/dashboard/cliente/cliente.type").ListarCliente[];
    totalRegistros: number;
  }>({
    queryKey: ["clientes-listado", params],
    queryFn: () => listarClientes(params),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  return {
    clientes: response?.clientes ?? [],
    totalRegistros: response?.totalRegistros ?? 0,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
