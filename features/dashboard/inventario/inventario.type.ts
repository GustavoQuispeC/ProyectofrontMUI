export interface InventarioAutocompleteItem {
  productoId: number;
  productoNombre: string;
  productoCodigoInterno: string;
  stockActual: number;
  stockReservado: number;
  stockDisponible: number;
}

export interface ListarInventario {
  id: number;
  productoId: number;
  productoNombre: string;
  productoCodigoInterno: string;
  productoCodigoBarras: string | null;
  tiendaId: number;
  tiendaNombre: string;
  stockActual: number;
  stockReservado: number;
  stockDisponible: number;
  ultimaActualizacion: string;
}

export interface ListarInventarioRequest {
  pagina: number;
  tamanoPagina: number;
  tiendaId?: number;
  busquedaProducto?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}
