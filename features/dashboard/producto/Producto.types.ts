export interface ImagenProducto {
  url: string | null;
  esPrincipal: boolean;
  orden: number;
}

export interface PrecioProducto {
  listaPrecioId: number;
  precio: number;
  precioMinimo: number | null;
  precioMaximo: number | null;
  fechaInicio: string;
  fechaFin: string | null;
}

export interface CrearProductoRequest {
  codigoBarras: string | null;
  categoriaId: number;
  marcaId: number;
  unidadMedidaId: number;
  nombre: string;
  descripcion: string | null;
  costoActual: number;
  stockMinimo: number;
  fechaVencimiento: string | null;
  imagenes: ImagenProducto[];
  precios: PrecioProducto[];
}

export interface ProductoCreado {
  id: number;
  codigoBarras: string;
  categoriaId: number;
  marcaId: number;
  unidadMedidaId: number;
  nombre: string;
  descripcion: string;
  costoActual: number;
  stockMinimo: number;
  fechaVencimiento: string | null;
  imagenes: ImagenProducto[];
  precios: PrecioProducto[];
}
