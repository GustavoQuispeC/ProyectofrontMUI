export interface DetalleTransferencia {
  ProductoId: number;
  Cantidad: number;
}

export interface RegistrarTransferencia {
  TiendaOrigenId: number;
  TiendaDestinoId: number;
  Fecha: string; // formato YYYY-MM-DD
  Motivo: string | null;
  Detalles: DetalleTransferencia[];
}

export interface TransferenciaRegistrada {
  transferenciaId: number;
}

export interface ListarTransferenciaDetalle {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
}

export interface ListarTransferencia {
  id: number;
  tiendaOrigenId: number;
  tiendaOrigenNombre: string;
  tiendaDestinoId: number;
  tiendaDestinoNombre: string;
  fecha: string;
  motivo: string | null;
  detalles: ListarTransferenciaDetalle[];
  isActive: boolean;
  createdAt: string;
  createdByUserName: string;
  updatedAt: string | null;
  updatedByUserName: string | null;
}

export interface ListarTransferenciasRequest {
  pagina: number;
  tamanoPagina: number;
  tiendaOrigenId?: number;
  tiendaDestinoId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  busquedaProducto?: string;
}
