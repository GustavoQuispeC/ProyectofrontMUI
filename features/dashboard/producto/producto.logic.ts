import { getAuthUser } from "@/shared/auth/auth.service";
import {
  crearProductoApi,
  subirImagenApi,
  obtenerProductosApi,
  obtenerProductoPorIdApi,
  editarProductoApi,
  listarProductosCatalogoVentaApi,
} from "./producto.service";
import {
  CrearProductoRequest,
  EditarProductoRequest,
  ListarProductosRequest,
  ListarProductosVentaRequest,
} from "./Producto.types";

//! Crear producto
export async function crearProducto(data: CrearProductoRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return crearProductoApi(data);
}

//! Subir imagen
export async function subirImagenLogic(file: File) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return subirImagenApi(file);
}

//! Obtener productos
export async function obtenerProductos(params: ListarProductosRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  const response = await obtenerProductosApi(params);
  return response;
}

//! Obtener producto por Id
export async function obtenerProductoPorId(id: string) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return obtenerProductoPorIdApi(id);
}

//! Editar producto
export async function editarProducto(id: number, data: EditarProductoRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return editarProductoApi(id, data);
}

//! Listar catálogo de productos para venta
export async function listarProductosCatalogoVenta(params: ListarProductosVentaRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return listarProductosCatalogoVentaApi(params);
}
