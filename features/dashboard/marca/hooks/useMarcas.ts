import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listarMarcas, obtenerMarca, registrarMarca, editarMarca, subirLogoMarcaLogic } from "../marca.logic";
import { ListarMarca, DetalleMarca, RegistrarMarcaRequest, EditarMarcaRequest } from "../Marca.types";

export function useMarcas(canAccess: boolean) {
  const {
    data: marcas = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ListarMarca[]>({
    queryKey: ["marcas"],

    queryFn: listarMarcas,

    staleTime: 1000 * 60 * 5,

    retry: 1,

    enabled: canAccess,
  });

  return {
    marcas,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}

export function useMarca(id: number | null) {
  const {
    data: marca,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<DetalleMarca>({
    queryKey: ["marca", id],

    queryFn: () => obtenerMarca(id!),

    enabled: !!id,

    retry: 1,
  });

  return {
    marca,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}

export function useRegistrarMarca() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: registrar,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: (data: RegistrarMarcaRequest) => registrarMarca(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marcas"] });
    },
  });

  return {
    registrarMarca: registrar,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}

export function useEditarMarca(id: number) {
  const queryClient = useQueryClient();

  const {
    mutateAsync: editar,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: (data: EditarMarcaRequest) => editarMarca(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marcas"] });
      queryClient.invalidateQueries({ queryKey: ["marca", id] });
    },
  });

  return {
    editarMarca: editar,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}

export function useSubirLogoMarca() {
  const {
    mutateAsync: subir,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: (file: File) => subirLogoMarcaLogic(file),
  });

  return {
    subirLogo: subir,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}
