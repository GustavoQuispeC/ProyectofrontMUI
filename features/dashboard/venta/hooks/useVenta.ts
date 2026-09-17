import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listarVentas, registrarVenta } from "../venta.logic";
import { ListarVentasRequest, RegistrarVentaRequest } from "../venta.type";
import {
  listarTiposPago,
  listarModalidadesEntrega,
  listarMediosPago,
  listarEstadosVenta,
  listarEstadosPago,
  listarTiposDocumento,
} from "@/features/dashboard/catalogo/catalogo.service";
import { CatalogoItem } from "@/features/dashboard/catalogo/catalogo.type";

export function useVentas(params: ListarVentasRequest) {
  const {
    data: response,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["ventas", params],
    queryFn: () => listarVentas(params),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  return {
    ventas: response?.ventas ?? [],
    totalRegistros: response?.totalRegistros ?? 0,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}

export function useRegistrarVenta() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: registrar,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: (data: RegistrarVentaRequest) => registrarVenta(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
      queryClient.invalidateQueries({ queryKey: ["inventario-autocomplete"] });
      queryClient.invalidateQueries({ queryKey: ["caja-sesion-activa"] });
    },
  });

  return {
    registrarVenta: registrar,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}

function useCatalogoVenta(key: string, queryFn: () => Promise<CatalogoItem[]>) {
  const {
    data = [],
    isLoading: loading,
    error,
  } = useQuery<CatalogoItem[]>({
    queryKey: ["catalogo", key],
    queryFn,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  return {
    items: data ?? [],
    loading,
    error: error instanceof Error ? error.message : null,
  };
}

export function useTiposPago() {
  return useCatalogoVenta("tipos-pago", listarTiposPago);
}

export function useModalidadesEntrega() {
  return useCatalogoVenta("modalidades-entrega", listarModalidadesEntrega);
}

export function useMediosPago() {
  return useCatalogoVenta("medio-pago", listarMediosPago);
}

export function useEstadosVenta() {
  return useCatalogoVenta("estados-venta", listarEstadosVenta);
}

export function useEstadosPago() {
  return useCatalogoVenta("estados-pago", listarEstadosPago);
}

export function useTiposDocumento() {
  return useCatalogoVenta("tipos-documento", listarTiposDocumento);
}
