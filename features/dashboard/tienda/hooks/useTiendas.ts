import { useQuery } from "@tanstack/react-query";
import { listarTiendas } from "../tienda.logic";
import { ListarTienda } from "../tienda.type";

export function useTiendas(canAccess: boolean) {
  const {
    data: tiendas = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ListarTienda[]>({
    queryKey: ["tiendas"],
    queryFn: listarTiendas,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: canAccess,
  });

  return {
    tiendas,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
