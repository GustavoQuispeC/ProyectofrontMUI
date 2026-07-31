import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearProducto } from "../producto.logic";
import { CrearProductoRequest } from "../Producto.types";

export function useCrearProducto() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: crear,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: (data: CrearProductoRequest) => crearProducto(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });

  return {
    crearProducto: crear,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}
