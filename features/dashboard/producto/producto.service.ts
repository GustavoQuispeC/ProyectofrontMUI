import { apiProducto } from "@/lib/api-producto";
import {
  CrearProductoRequest,
  ProductoCreado,
  ProductosResponse,
  DetalleProducto,
  ListarProductosRequest,
} from "./Producto.types";
import { getToken } from "@/shared/auth/auth.service";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//! Obtener productos
export async function obtenerProductosApi(params: ListarProductosRequest): Promise<ProductosResponse> {
  const token = getToken();
  const query = new URLSearchParams();

  query.append("pagina", String(params.pagina));
  query.append("tamanoPagina", String(params.tamanoPagina));

  if (params.busqueda) query.append("busqueda", params.busqueda);
  if (params.categoriaId) query.append("categoriaId", String(params.categoriaId));
  if (params.marcaId) query.append("marcaId", String(params.marcaId));
  if (params.unidadMedidaId) query.append("unidadMedidaId", String(params.unidadMedidaId));
  if (params.isActive !== undefined) query.append("isActive", String(params.isActive));
  if (params.ordenarPor) query.append("ordenarPor", params.ordenarPor);
  if (params.ordenamiento) query.append("ordenamiento", params.ordenamiento);

  const response = await fetch(`${apiUrl}/productos?${query.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al obtener productos: ${errorText}`);
  }

  return response.json();
}

//! Crear producto
export function crearProductoApi(data: CrearProductoRequest): Promise<ProductoCreado> {
  return apiProducto(`${apiUrl}/productos`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

//! Subir imagen
export async function subirImagenApi(file: File): Promise<{ url: string; rutaRelativa: string }> {
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

//! Obtener producto por Id
export async function obtenerProductoPorIdApi(id: string): Promise<DetalleProducto> {
  const token = getToken();

  const response = await fetch(`${apiUrl}/productos/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al obtener producto: ${errorText}`);
  }

  return response.json();
}
