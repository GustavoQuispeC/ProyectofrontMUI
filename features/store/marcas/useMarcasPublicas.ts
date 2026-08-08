import { useQuery } from "@tanstack/react-query";
import { listarMarcasPublicasApi } from "./marcasPublicas.service";
import { ListarMarca } from "@/features/dashboard/marca/Marca.types";

export function useMarcasPublicas() {
  const {
    data: marcas = [],
    isLoading: loading,
    error,
  } = useQuery<ListarMarca[]>({
    queryKey: ["marcas-publicas"],
    queryFn: listarMarcasPublicasApi,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    marcas,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}
