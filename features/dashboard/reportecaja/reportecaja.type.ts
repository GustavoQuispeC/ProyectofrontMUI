export interface NotaAfectada {
  ventaId: number;
  ventaCodigo: string;
  montoAplicado: number;
}

export interface ReporteCajaPago {
  pagoId: number;
  pagoCodigo: string;
  fechaPago: string;
  clienteId?: number | null;
  clienteNombre?: string | null;
  notasAfectadas: NotaAfectada[];
  formaPago: number;
  banco?: string | null;
  numeroOperacion?: string | null;
  importe: number;
  tiendaId?: number | null;
  tiendaNombre?: string | null;
  cajaSesionId: number;
  usuarioId?: number | null;
  usuarioNombre?: string | null;
}

export interface ListarReporteCajaPagosRequest {
  tiendaId?: number | null;
  cajaSesionId?: number | null;
  clienteId?: number | null;
  formaPago?: number | null;
  fechaDesde?: string | null;
  fechaHasta?: string | null;
  pagina?: number;
  tamanoPagina?: number;
}

export interface ListarReporteCajaPagosResponse {
  items: ReporteCajaPago[];
  totalCount: number;
  pagina: number;
  tamanoPagina: number;
  totalPaginas: number;
}
