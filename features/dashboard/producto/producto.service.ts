import { apiProducto } from "@/lib/api-producto";
import { CrearProductoRequest, ProductoCreado } from "./Producto.types";
import { getToken } from "@/shared/auth/auth.service";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function crearProductoApi(data: CrearProductoRequest): Promise<ProductoCreado> {
  return apiProducto(`${apiUrl}/productos`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Función para subir imagen individual al backend
export async function subirImagen(file: File): Promise<{ url: string; rutaRelativa: string }> {
  const formData = new FormData();
  formData.append("archivo", file);

  const token = getToken();

  const response = await fetch(`${apiUrl}/productos/subir-imagen-producto`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al subir imagen: ${errorText}`);
  }

  return response.json();
}
