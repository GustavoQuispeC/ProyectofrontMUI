export interface RegistrarVentaDetalle {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  descuentoUnitario: number;
  observaciones?: string | null;
}

export interface RegistrarVentaPago {
  tipoMedio: number;
  monto: number;
  montoRecibido?: number | null;
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
  costoEnvio: number;
  observaciones?: string | null;
  modalidadEntrega: number;
  direccionEntrega?: string | null;
  detalles: RegistrarVentaDetalle[];
  pagos: RegistrarVentaPago[];
}

export type VentaRegistrada = Venta;

export interface VentaDetalle {
  id: number;
  ventaId?: number;
  productoId: number;
  productoNombre: string;
  productoCodigo: string;
  cantidad: number;
  precioUnitario: number;
  descuentoUnitario: number;
  subtotal: number;
  impuesto: number;
  total: number;
  observaciones?: string | null;
}

export interface Venta {
  id: number;
  codigo: string;
  clienteId: number;
  clienteNombre: string;
  clienteTipoDocumento: number;
  clienteNumeroDocumento: string;
  clienteTelefono: string | null;
  tiendaId: number;
  tiendaNombre: string;
  estado: number;
  tipoPago: number;
  estadoPago: number;
  descuento: number;
  costoEnvio: number;
  total: number;
  montoPagado: number;
  montoRecibido: number;
  vuelto: number;
  observaciones: string | null;
  empleadoAtiendeId?: number;
  empleadoAtiendeNombre: string;
  fechaConfirmacion: string;
  createdAt?: string;
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
