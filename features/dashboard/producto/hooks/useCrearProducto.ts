import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearProducto, subirImagenLogic } from "../producto.logic";
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

// Hook para subir imagen individual
export function useSubirImagen() {
  const {
    mutateAsync: subir,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: (file: File) => subirImagenLogic(file),
  });

  return {
    subirImagen: subir,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}
