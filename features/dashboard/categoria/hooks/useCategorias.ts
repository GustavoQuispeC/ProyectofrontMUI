import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listarCategorias,
  listarCategoriasPublicas,
  registrarCategoria,
  subirImagenCategoriaLogic,
} from "../categoria.logic";
import { ListarCategoria, RegistrarCategoriaRequest } from "../Categoria.types";

export function useCategorias(canAccess: boolean) {
  const {
    data: categorias = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ListarCategoria[]>({
    queryKey: ["categorias"],

    queryFn: listarCategorias,

    staleTime: 1000 * 60 * 5,

    retry: 1,

    enabled: canAccess,
  });

  return {
    categorias,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}

export function useCategoriasPublicas() {
  const {
    data: categorias = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ListarCategoria[]>({
    queryKey: ["categorias-publicas"],

    queryFn: listarCategoriasPublicas,

    staleTime: 1000 * 60 * 5,

    retry: 1,
  });

  return {
    categorias,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}

export function useRegistrarCategoria() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: registrar,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: (data: RegistrarCategoriaRequest) => registrarCategoria(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  return {
    registrarCategoria: registrar,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}

export function useSubirImagen() {
  const {
    mutateAsync: subir,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: (file: File) => subirImagenCategoriaLogic(file),
  });

  return {
    subirImagen: subir,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}
