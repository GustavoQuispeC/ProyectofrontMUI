import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  abrirCajaSesion,
  cerrarCajaSesion,
  obtenerCajaSesion,
  obtenerCajaSesionActiva,
  listarCajaSesionesPorTienda,
} from "../caja.logic";
import { AbrirCajaSesionRequest, CerrarCajaSesionRequest, CajaSesion } from "../caja.type";

//! Sesión abierta de una tienda
export function useCajaSesionActiva(tiendaId: number | null, canAccess: boolean) {
  const {
    data: sesion = null,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<CajaSesion | null>({
    queryKey: ["caja-sesion-activa", tiendaId],
    queryFn: () => obtenerCajaSesionActiva(tiendaId!),
    enabled: canAccess && !!tiendaId,
    retry: 1,
  });

  return {
    sesion,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}

//! Sesión por id
export function useCajaSesion(id: number | null) {
  const {
    data: sesion = null,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<CajaSesion | null>({
    queryKey: ["caja-sesion", id],
    queryFn: () => obtenerCajaSesion(id!),
    enabled: !!id,
    retry: 1,
  });

  return {
    sesion,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}

//! Historial de sesiones de una tienda
export function useCajaSesionesPorTienda(tiendaId: number | null, canAccess: boolean) {
  const {
    data: sesiones = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<CajaSesion[]>({
    queryKey: ["caja-sesiones", tiendaId],
    queryFn: () => listarCajaSesionesPorTienda(tiendaId!),
    enabled: canAccess && !!tiendaId,
    retry: 1,
  });

  return {
    sesiones: sesiones ?? [],
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}

export function useAbrirCajaSesion() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: abrir,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: (data: AbrirCajaSesionRequest) => abrirCajaSesion(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["caja-sesion-activa", variables.tiendaId] });
      queryClient.invalidateQueries({ queryKey: ["caja-sesiones", variables.tiendaId] });
    },
  });

  return {
    abrirCaja: abrir,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}

export function useCerrarCajaSesion(tiendaId: number | null) {
  const queryClient = useQueryClient();

  const {
    mutateAsync: cerrar,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: (data: CerrarCajaSesionRequest) => cerrarCajaSesion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caja-sesion-activa", tiendaId] });
      queryClient.invalidateQueries({ queryKey: ["caja-sesiones", tiendaId] });
    },
  });

  return {
    cerrarCaja: cerrar,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}
