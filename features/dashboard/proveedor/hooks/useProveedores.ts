import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listarProveedores, cambiarEstadoProveedor, registrarProveedor } from "../proveedor.logic";
import { ListarProveedor, RegistrarProveedorRequest } from "../proveedor.type";

export function useProveedores(canAccess: boolean) {
  const {
    data: proveedores = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ListarProveedor[]>({
    queryKey: ["proveedores"],

    queryFn: listarProveedores,

    staleTime: 1000 * 60 * 5,

    retry: 1,

    enabled: canAccess,
  });

  return {
    proveedores,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}

export function useCambiarEstadoProveedor() {
  const queryClient = useQueryClient();

  const { mutateAsync: cambiarEstado, isPending: loading } = useMutation({
    mutationFn: (id: number) => cambiarEstadoProveedor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    },
  });

  return {
    cambiarEstadoProveedor: cambiarEstado,
    loading,
  };
}

export function useRegistrarProveedor() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: registrar,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: (data: RegistrarProveedorRequest) => registrarProveedor(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    },
  });

  return {
    registrarProveedor: registrar,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}
