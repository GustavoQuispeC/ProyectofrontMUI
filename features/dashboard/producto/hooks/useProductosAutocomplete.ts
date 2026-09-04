import { useQuery } from "@tanstack/react-query";
import { obtenerProductos } from "../producto.logic";

export function useProductosAutocomplete() {
  const {
    data: response,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["productos-autocomplete"],
    queryFn: () =>
      obtenerProductos({
        pagina: 1,
        tamanoPagina: 1000,
        isActive: true,
      }),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    productos: response?.productos ?? [],
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
