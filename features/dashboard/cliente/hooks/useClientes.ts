import { useQuery } from "@tanstack/react-query";
import { buscarCliente } from "../cliente.logic";
import { BuscarClienteResponse } from "../cliente.type";

export function useClientes(documento: string, canAccess: boolean = true) {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<BuscarClienteResponse>({
    queryKey: ["clientes", documento],
    queryFn: () => buscarCliente(documento),
    enabled: !!documento.trim() && canAccess,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return {
    cliente: data?.cliente ?? null,
    datosApi: data?.datosApi ?? null,
    existe: data?.existe ?? false,
    loading,
    error: error?.message || null,
    refetch,
  };
}
