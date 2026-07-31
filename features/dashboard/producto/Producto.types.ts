export interface ImagenProducto {
  url: string;
  esPrincipal: boolean;
  orden: number;
}

export interface PrecioProducto {
  listaPrecioId: number;
  precio: number;
  precioMinimo: number;
  precioMaximo: number;
  fechaInicio: string;
  fechaFin: string | null;
}

export interface CrearProductoRequest {
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
