export interface DetalleIngreso {
  ProductoId: number;
  Cantidad: number;
}

export interface RegistrarIngreso {
  ProveedorId: number;
  TiendaDestinoId: number;
  TipoDocumento: number;
  SerieDocumento: string;
  NumeroDocumento: string;
  Fecha: string; // formato YYYY-MM-DD
  Observaciones: string | null;
  MontoTotal: number;
  Detalles: DetalleIngreso[];
}

export interface IngresoRegistrado {
  ingresoId: number;
}

export interface ListarIngresoDetalle {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
}

export interface ListarIngreso {
  id: number;
  proveedorId: number;
  proveedorRazonSocial: string;
  tiendaDestinoId: number;
  tiendaNombre: string;
  tipoDocumento: number;
  serieDocumento: string;
  numeroDocumento: string;
  fecha: string;
  observaciones: string | null;
  montoTotal: number;
  detalles: ListarIngresoDetalle[];
  isActive: boolean;
  createdAt: string;
  createdByUserName: string;
  updatedAt: string | null;
  updatedByUserName: string | null;
}

export interface ListarIngresosRequest {
  pagina: number;
  tamanoPagina: number;
  tiendaId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  busquedaProducto?: string;
}
