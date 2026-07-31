import { getAuthUser } from "@/shared/auth/auth.service";
import { crearProductoApi } from "./producto.service";
import { CrearProductoRequest } from "./Producto.types";

export async function crearProducto(data: CrearProductoRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return crearProductoApi(data);
}
