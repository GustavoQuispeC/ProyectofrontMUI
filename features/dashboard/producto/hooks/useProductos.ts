import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  crearProducto,
  subirImagenLogic,
  obtenerProductos,
  obtenerProductoPorId,
  editarProducto,
} from "../producto.logic";
import {
  CrearProductoRequest,
  DetalleProducto,
  EditarProductoRequest,
  ProductosResponse,
  ListarProductosRequest,
} from "../Producto.types";

//! Hook para listar productos
export function useProductos(params: ListarProductosRequest) {
  const {
    data: response,
    isLoading: loading,
    error,
  } = useQuery<ProductosResponse>({
    queryKey: ["productos", params],
    queryFn: () => obtenerProductos(params),
  });

  return {
    productos: response?.productos ?? [],
    paginacion: response?.paginacion,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}

//! Hook para obtener un producto por id
export function useProducto(id: string | null) {
  const {
    data: producto,
    isLoading: loading,
    error,
  } = useQuery<DetalleProducto>({
    queryKey: ["producto", id],
    queryFn: () => obtenerProductoPorId(id!),
    enabled: !!id,
    retry: 1,
  });

  return { producto, loading, error: error instanceof Error ? error.message : null };
}

//! Hook para crear producto
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

//! Hook para subir imagen individual
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

//! Hook para editar producto
export function useEditarProducto() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: editar,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EditarProductoRequest }) => editarProducto(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["producto", String(variables.id)] });
    },
  });

  return {
    editarProducto: editar,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}
