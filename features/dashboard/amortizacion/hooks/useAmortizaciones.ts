import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { amortizarCliente, amortizarVenta, listarVentasCredito } from "../amortizacion.logic";
import {
  AmortizarClienteRequest,
  AmortizarVentaRequest,
  ListarVentasCreditoRequest,
  VentaCredito,
} from "../amortizacion.type";

export function useVentasCredito(params: ListarVentasCreditoRequest, enabled: boolean) {
  const query = useQuery<{ ventas: VentaCredito[]; totalRegistros: number }>({
    queryKey: ["ventas-credito", params],
    queryFn: () => listarVentasCredito(params),
    enabled,
    staleTime: 1000 * 60,
    retry: 1,
  });

  return {
    ventas: query.data?.ventas ?? [],
    totalRegistros: query.data?.totalRegistros ?? 0,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}

export function useDeudaCliente(clienteId: number | null, enabled: boolean) {
  const query = useQuery<number>({
    queryKey: ["deuda-cliente", clienteId],
    queryFn: async () => {
      const pageSize = 100;
      const primeraPagina = await listarVentasCredito({
        clienteId: clienteId ?? undefined,
        pagina: 1,
        tamanoPagina: pageSize,
      });
      const totalPaginas = Math.ceil(primeraPagina.totalRegistros / pageSize);
      const paginasRestantes = await Promise.all(
        Array.from({ length: Math.max(0, totalPaginas - 1) }, (_item, index) =>
          listarVentasCredito({
            clienteId: clienteId ?? undefined,
            pagina: index + 2,
            tamanoPagina: pageSize,
          }),
        ),
      );
      const ventas = [...primeraPagina.ventas, ...paginasRestantes.flatMap((pagina) => pagina.ventas)];

      return ventas.reduce((total, venta) => total + Math.max(0, Number(venta.total) - Number(venta.montoPagado)), 0);
    },
    enabled,
    staleTime: 1000 * 30,
    retry: 1,
  });

  return {
    totalDeuda: query.data ?? 0,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}

export function useAmortizarVenta() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ ventaId, data }: { ventaId: number; data: AmortizarVentaRequest }) => amortizarVenta(ventaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas-credito"] });
      queryClient.invalidateQueries({ queryKey: ["deuda-cliente"] });
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
    },
  });

  return {
    amortizar: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}

export function useAmortizarCliente() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ clienteId, data }: { clienteId: number; data: AmortizarClienteRequest }) =>
      amortizarCliente(clienteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas-credito"] });
      queryClient.invalidateQueries({ queryKey: ["deuda-cliente"] });
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
    },
  });

  return {
    amortizar: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}
