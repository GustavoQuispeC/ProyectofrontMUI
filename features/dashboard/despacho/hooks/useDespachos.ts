import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { listarEstadosDespacho } from "@/features/dashboard/catalogo/catalogo.service";
import { CatalogoItem } from "@/features/dashboard/catalogo/catalogo.type";
import {
  asignarConductorVehiculo,
  completarDespacho,
  despacharEnTienda,
  listarConductoresDespacho,
  listarDespachosPorVenta,
  marcarDespachoEnRuta,
} from "../despacho.logic";
import { AsignarConductorVehiculoRequest, ConductorDespacho, Despacho, EnRutaRequest } from "../despacho.type";

export function useDespachosPorVenta(ventaId: number | null) {
  const query = useQuery<Despacho[]>({
    queryKey: ["despachos", "venta", ventaId],
    queryFn: () => listarDespachosPorVenta(ventaId as number),
    enabled: ventaId !== null && ventaId > 0,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  return {
    despachos: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}

export function useConductoresDespacho(enabled: boolean) {
  const query = useQuery<ConductorDespacho[]>({
    queryKey: ["despachos", "conductores"],
    queryFn: listarConductoresDespacho,
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    conductores: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}

export function useAsignarConductorVehiculo(ventaId: number | null) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AsignarConductorVehiculoRequest }) =>
      asignarConductorVehiculo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despachos", "venta", ventaId] });
    },
  });

  return {
    asignar: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}

export function useMarcarDespachoEnRuta(ventaId: number | null) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ despacho, data }: { despacho: Despacho; data?: EnRutaRequest }) =>
      marcarDespachoEnRuta(despacho, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despachos", "venta", ventaId] });
    },
  });

  return {
    marcarEnRuta: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}

export function useDespacharEnTienda(ventaId: number | null) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ despacho, data }: { despacho: Despacho; data: EnRutaRequest }) => despacharEnTienda(despacho, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despachos", "venta", ventaId] });
    },
  });

  return {
    despachar: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}

export function useCompletarDespacho(ventaId: number | null) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ despacho }: { despacho: Despacho }) => completarDespacho(despacho),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despachos", "venta", ventaId] });
    },
  });

  return {
    completar: mutation.mutateAsync,
    completandoId: mutation.isPending ? (mutation.variables?.despacho.id ?? null) : null,
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}

export function useDespachosCompletadosPorVentas(ventaIds: number[]) {
  const queries = useQueries({
    queries: ventaIds.map((ventaId) => ({
      queryKey: ["despachos", "venta", ventaId],
      queryFn: () => listarDespachosPorVenta(ventaId),
      staleTime: 1000 * 60 * 2,
      retry: 1,
    })),
  });

  const completados = new Map<number, boolean>();

  queries.forEach((query, index) => {
    const despachos = query.data ?? [];
    const completado =
      despachos.some((despacho) => despacho.estado === 3) &&
      !despachos.some((despacho) => despacho.estado === 1 || despacho.estado === 2);

    completados.set(ventaIds[index], completado);
  });

  return { completados };
}

export function useEstadosDespacho() {
  const query = useQuery<CatalogoItem[]>({
    queryKey: ["catalogo", "estados-despacho"],
    queryFn: listarEstadosDespacho,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  return {
    estados: query.data ?? [],
    loading: query.isLoading,
  };
}
