import { useQuery } from "@tanstack/react-query";
import { listarReporteCajaPagos } from "../reportecaja.logic";
import { ListarReporteCajaPagosRequest } from "../reportecaja.type";

export function useReporteCajaPagos(params: ListarReporteCajaPagosRequest, canAccess: boolean) {
  const {
    data: response,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reporte-caja-pagos", params],
    queryFn: () => listarReporteCajaPagos(params),
    enabled: canAccess && !!params.fechaDesde && !!params.fechaHasta,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  return {
    pagos: response?.items ?? [],
    totalRegistros: response?.totalCount ?? 0,
    pagina: response?.pagina ?? 1,
    tamanoPagina: response?.tamanoPagina ?? 50,
    totalPaginas: response?.totalPaginas ?? 1,
    loading,
    error: error instanceof Error ? error.message : null,
    refetch,
  };
}
