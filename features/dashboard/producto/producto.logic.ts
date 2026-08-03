import { getAuthUser } from "@/shared/auth/auth.service";
import { crearProductoApi, subirImagen } from "./producto.service";
import { CrearProductoRequest } from "./Producto.types";

export async function crearProducto(data: CrearProductoRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return crearProductoApi(data);
}

// Función para subir imagen individual
export async function subirImagenLogic(file: File) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return subirImagen(file);
}
