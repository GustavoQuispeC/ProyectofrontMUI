import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listarVehiculos,
  obtenerVehiculo,
  registrarVehiculo,
  editarVehiculo,
  eliminarVehiculo,
} from "../vehiculo.logic";
import {
  ListarVehiculo,
  DetalleVehiculo,
  RegistrarVehiculoRequest,
  EditarVehiculoRequest,
} from "../vehiculo.type";

export function useVehiculos(canAccess: boolean) {
  const {
    data: vehiculos = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ListarVehiculo[]>({
    queryKey: ["vehiculos"],

    queryFn: listarVehiculos,

    staleTime: 1000 * 60 * 5,

    retry: 1,

    enabled: canAccess,
  });

  return {
    vehiculos,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}

export function useVehiculo(id: number | null) {
  const {
    data: vehiculo,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<DetalleVehiculo>({
    queryKey: ["vehiculo", id],

    queryFn: () => obtenerVehiculo(id!),

    enabled: !!id,

    retry: 1,
  });

  return {
    vehiculo,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}

export function useRegistrarVehiculo() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: registrar,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: (data: RegistrarVehiculoRequest) => registrarVehiculo(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehiculos"] });
    },
  });

  return {
    registrarVehiculo: registrar,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}

export function useEditarVehiculo(id: number) {
  const queryClient = useQueryClient();

  const {
    mutateAsync: editar,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: (data: EditarVehiculoRequest) => editarVehiculo(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehiculos"] });
      queryClient.invalidateQueries({ queryKey: ["vehiculo", id] });
    },
  });

  return {
    editarVehiculo: editar,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}

export function useEliminarVehiculo() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: eliminar,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: (id: number) => eliminarVehiculo(id),

    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["vehiculos"] });
      queryClient.invalidateQueries({ queryKey: ["vehiculo", id] });
    },
  });

  return {
    eliminarVehiculo: eliminar,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}
