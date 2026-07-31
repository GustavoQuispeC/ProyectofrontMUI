import { useQuery } from "@tanstack/react-query";
import { listarListasPrecio } from "../listaPrecio.logic";
import { ListarListaPrecio } from "../ListaPrecio.types";

export function useListasPrecio(canAccess: boolean) {
  const {
    data: listasPrecio = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ListarListaPrecio[]>({
    queryKey: ["listasPrecio"],

    queryFn: listarListasPrecio,

    staleTime: 1000 * 60 * 5,

    retry: 1,

    enabled: canAccess,
  });

  return {
    listasPrecio,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
