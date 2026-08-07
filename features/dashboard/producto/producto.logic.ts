import { getAuthUser } from "@/shared/auth/auth.service";
import { crearProductoApi, subirImagenApi, obtenerProductosApi, obtenerProductoPorIdApi } from "./producto.service";
import { CrearProductoRequest, ListarProductosRequest } from "./Producto.types";

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
