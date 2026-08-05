import { apiCategoria } from "@/lib/api-categoria";
import {
  ListarCategoria,
  DetalleCategoria,
  RegistrarCategoriaRequest,
  EditarCategoriaRequest,
  CategoriaRegistrada,
} from "./Categoria.types";
import { getToken } from "@/shared/auth/auth.service";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Listar categorias
export function listarCategoriasApi(): Promise<ListarCategoria[]> {
  return apiCategoria(`${apiUrl}/categorias`, {
    method: "GET",
  });
}

//! Listar categorias (publico - sin autenticacion)
export function listarCategoriasPublicasApi(): Promise<ListarCategoria[]> {
  return fetch(`${apiUrl}/categorias`, {
    method: "GET",
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Error al obtener categorías");
    }
    return res.json();
  });
}

//! Obtener categoria por id
export function obtenerCategoriaApi(id: number): Promise<DetalleCategoria> {
  return apiCategoria(`${apiUrl}/categorias/${id}`, {
    method: "GET",
  });
}

//! Registrar categoria
export function registrarCategoriaApi(data: RegistrarCategoriaRequest): Promise<CategoriaRegistrada> {
  return apiCategoria(`${apiUrl}/categorias`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

//! Editar categoria
export function editarCategoriaApi(data: EditarCategoriaRequest): Promise<CategoriaRegistrada> {
  return apiCategoria(`${apiUrl}/categorias/${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function subirImagenCategoria(file: File): Promise<{ url: string; rutaRelativa: string }> {
  const formData = new FormData();
  formData.append("archivo", file);

  const token = getToken();

  const response = await fetch(`${apiUrl}/categorias/subir-imagen-categoria`, {
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
