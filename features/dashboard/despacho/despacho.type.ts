export type ModalidadDespacho = "Recojo_tienda" | "Envio_domicilio" | 1 | 2;

export interface ConductorDespacho {
  id: number;
  nombreCompleto: string;
  codigoEmpleado?: string | null;
}

export interface AsignarConductorVehiculoRequest {
  conductorEmpleadoId: number;
  vehiculoId: number;
  fechaProgramada: string;
}

export interface EnRutaDetalleRequest {
  despachoDetalleId: number;
  cantidad: number;
}

export interface EnRutaRequest {
  detalles: EnRutaDetalleRequest[];
}

export interface DespachoDetalle {
  id: number;
  despachoId: number;
  detalleVentaId: number;
  productoId: number;
  productoNombre: string;
  productoCodigo: string;
  cantidad: number;
  cantidadTotalVenta: number;
  cantidadYaDespachada: number;
  cantidadPendiente: number;
}

export interface Despacho {
  id: number;
  codigo: string;
  ventaId: number;
  ventaCodigo: string;
  tiendaId: number;
  tiendaNombre: string;
  modalidad: ModalidadDespacho;
  estado: number;
  conductorEmpleadoId: number | null;
  conductorNombre: string | null;
  vehiculoId: number | null;
  vehiculoPlaca: string | null;
  direccionEntrega: string | null;
  fechaProgramada: string;
  fechaEntrega: string | null;
  observaciones: string | null;
  createdAt: string;
  detalles: DespachoDetalle[];
}
