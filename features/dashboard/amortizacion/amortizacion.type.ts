export interface VentaCreditoDetalle {
  productoNombre: string;
  productoCodigo: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface VentaCredito {
  id: number;
  codigo: string;
  clienteId?: number;
  clienteNombre: string;
  tiendaId?: number;
  tiendaNombre: string;
  total: number;
  montoPagado: number;
  estadoPago: number;
  createdAt: string;
  detalles: VentaCreditoDetalle[];
}

export interface ListarVentasCreditoRequest {
  tiendaId?: number;
  clienteId?: number;
  estadoPago?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  pagina?: number;
  tamanoPagina?: number;
}

export interface ListarVentasCreditoResponse {
  items: VentaCredito[];
  totalCount: number;
  pagina: number;
  tamanoPagina: number;
  totalPaginas: number;
}

export interface AmortizacionPago {
  tipoMedio: number;
  monto: number;
  banco?: string | null;
  numeroOperacion?: string | null;
  fechaPago?: string | null;
}

export interface AmortizarVentaRequest {
  pagos: AmortizacionPago[];
}

export interface AmortizarClienteRequest {
  tiendaId: number;
  pagos: AmortizacionPago[];
}

export interface ReporteDeudasPdfRequest {
  clienteNombreORazonSocial?: string;
  tiendaId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}
