import { apiProducto } from "@/lib/api-producto";
import { CrearProductoRequest, ProductoCreado } from "./Producto.types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function crearProductoApi(data: CrearProductoRequest): Promise<ProductoCreado> {
  return apiProducto(`${apiUrl}/productos`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
