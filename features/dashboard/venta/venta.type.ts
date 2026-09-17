export interface RegistrarVentaDetalle {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  descuentoUnitario: number;
}

export interface RegistrarVentaPago {
  tipoMedio: number;
  monto: number;
  banco?: string | null;
  numeroOperacion?: string | null;
  fechaDeposito?: string | null;
}

export interface RegistrarVentaRequest {
  clienteId: number;
  clienteTipoDocumento: number;
  tiendaId: number;
  tipoPago: number;
  descuento: number;
  modalidadEntrega: number;
  direccionEntrega?: string | null;
  detalles: RegistrarVentaDetalle[];
  pagos: RegistrarVentaPago[];
}

export interface VentaRegistrada {
  id: number;
  [key: string]: unknown;
}

export interface VentaDetalle {
  id: number;
  productoId: number;
  productoNombre: string;
  productoCodigo: string;
  cantidad: number;
  precioUnitario: number;
  descuentoUnitario: number;
  subtotal: number;
  impuesto: number;
  total: number;
}

export interface Venta {
  id: number;
  codigo: string;
  clienteId: number;
  clienteNombre: string;
  clienteTipoDocumento: number;
  clienteNumeroDocumento: string;
  tiendaId: number;
  tiendaNombre: string;
  estado: number;
  tipoPago: number;
  estadoPago: number;
  descuento: number;
  total: number;
  montoPagado: number;
  empleadoAtiendeNombre: string;
  fechaConfirmacion: string;
  detalles: VentaDetalle[];
}

export interface ListarVentasRequest {
  pagina?: number;
  tamanoPagina?: number;
  tiendaId?: number;
  clienteId?: number;
  usuarioId?: string;
  codigo?: string;
  estado?: number;
  estadoPago?: number;
  tipoPago?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface ListarVentasResponse {
  items: Venta[];
  totalCount: number;
  pagina: number;
  tamanoPagina: number;
  totalPaginas: number;
}
