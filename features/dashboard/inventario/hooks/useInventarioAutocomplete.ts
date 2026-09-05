import { useQuery } from "@tanstack/react-query";
import { inventarioAutocompleteApi } from "../inventario.service";
import { InventarioAutocompleteItem } from "../inventario.type";

export function useInventarioAutocomplete(tiendaId?: number, busqueda?: string) {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<InventarioAutocompleteItem[]>({
    queryKey: ["inventario-autocomplete", tiendaId, busqueda],
    queryFn: () => inventarioAutocompleteApi(tiendaId as number, busqueda),
    enabled: !!tiendaId,
    staleTime: 0,
    refetchOnMount: "always",
    retry: 1,
  });

  return {
    inventario: data ?? [],
    loading,
    error: error instanceof Error ? error.message : null,
  };
}
