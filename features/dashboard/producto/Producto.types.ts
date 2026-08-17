export interface ImagenProducto {
  id?: number;
  url: string | null;
  esPrincipal: boolean;
  orden: number;
}

export interface PrecioProducto {
  id?: number;
  listaPrecioId: number;
  listaPrecioNombre?: string;
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

export interface EditarImagenProductoRequest {
  id?: number;
  url: string;
  esPrincipal: boolean;
  orden: number;
  eliminar?: boolean;
}

export interface EditarPrecioProductoRequest {
  id?: number;
  listaPrecioId: number;
  precio: number;
  precioMinimo: number | null;
  precioMaximo: number | null;
  fechaInicio?: string;
  eliminar?: boolean;
}

export interface EditarProductoRequest {
  codigoBarras: string | null;
  categoriaId: number;
  marcaId: number;
  unidadMedidaId: number;
  nombre: string;
  descripcion: string | null;
  costoActual: number;
  stockMinimo: number;
  fechaVencimiento: string | null;
  imagenes: EditarImagenProductoRequest[];
  precios: EditarPrecioProductoRequest[];
  isActive: boolean;
}

export interface ProductoBase {
  id: number;
  codigoInterno: string;
  codigoBarras: string | null;
  categoriaId: number;
  categoriaNombre: string;
  marcaId: number;
  marcaNombre: string;
  unidadMedidaId: number;
  unidadMedidaNombre: string;
  nombre: string;
  descripcion: string | null;
  costoActual: number;
  stockMinimo: number;
  fechaVencimiento: string | null;
  imagenes: ImagenProducto[];
  precios: PrecioProducto[];
  createdByUserName: string | null;
  isActive: boolean;
  createdAt: string;
}

export type ProductoCreado = ProductoBase;

export type ListarProducto = ProductoBase;

export type DetalleProducto = ProductoBase;

export interface Paginacion {
  paginaActual: number;
  tamanoPagina: number;
  totalRegistros: number;
  totalPaginas: number;
  tienePaginaAnterior: boolean;
  tienePaginaSiguiente: boolean;
}

export interface ProductosResponse {
  productos: ListarProducto[];
  paginacion: Paginacion;
}

export interface ListarProductosRequest {
  pagina: number;
  tamanoPagina: number;
  busqueda?: string;
  categoriaId?: number;
  marcaId?: number;
  unidadMedidaId?: number;
  isActive?: boolean;
  precioMax?: number;
  ordenarPor?: string;
  ordenamiento?: "asc" | "desc";
}
