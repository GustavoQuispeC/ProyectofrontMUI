export interface SalidaDetalleRequest {
  productoId: number;
  cantidad: number;
}

export interface CrearSalidaRequest {
  tiendaOrigenId: number;
  origen: number;
  empleadoSolicitaId?: number | null;
  ventaId?: number | null;
  motivo?: string | null;
  fecha: string;
  detalles: SalidaDetalleRequest[];
}

export interface SalidaDetalle {
  id: number;
  salidaId?: number;
  productoId: number;
  cantidad: number;
  productoNombre?: string;
}

export interface Salida {
  id: number;
  tiendaOrigenId: number;
  origen: number;
  empleadoSolicitaId: number | null;
  ventaId: number | null;
  motivo: string | null;
  fecha: string;
  detalles: SalidaDetalle[];
  createdAt: string;
  isActive: boolean;
}

export interface ListarSalidaDetalle {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
}

export interface ListarSalida {
  id: number;
  tiendaOrigenId: number;
  tiendaOrigenNombre: string;
  origen: number;
  origenDescripcion: string;
  empleadoSolicitaId: number | null;
  empleadoSolicitaNombre: string | null;
  ventaId: number | null;
  motivo: string | null;
  fecha: string;
  detalles: ListarSalidaDetalle[];
  isActive: boolean;
  createdAt: string;
  createdByUserName: string | null;
  updatedAt: string | null;
  updatedByUserName: string | null;
}

export interface ListarSalidasRequest {
  pagina: number;
  tamanoPagina: number;
  tiendaOrigenId?: number;
  origen?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}
