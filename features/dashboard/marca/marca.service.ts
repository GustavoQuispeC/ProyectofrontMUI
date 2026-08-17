import { apiMarca } from "@/lib/api-marca";
import { ListarMarca, DetalleMarca, RegistrarMarcaRequest, EditarMarcaRequest, MarcaRegistrada } from "./Marca.types";
import { getToken } from "@/shared/auth/auth.service";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Listar marcas
export function listarMarcasApi(): Promise<ListarMarca[]> {
  return apiMarca(`${apiUrl}/marcas`, {
    method: "GET",
  });
}

//! Obtener marca por id
export function obtenerMarcaApi(id: number): Promise<DetalleMarca> {
  return apiMarca(`${apiUrl}/marcas/${id}`, {
    method: "GET",
  });
}

//! Registrar marca
export function registrarMarcaApi(data: RegistrarMarcaRequest): Promise<MarcaRegistrada> {
  return apiMarca(`${apiUrl}/marcas`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

//! Editar marca
export function editarMarcaApi(data: EditarMarcaRequest): Promise<MarcaRegistrada> {
  return apiMarca(`${apiUrl}/marcas/${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

//! Subir logo de marca
export async function subirLogoMarca(file: File): Promise<{ url: string; rutaRelativa: string }> {
  const formData = new FormData();
  formData.append("archivo", file);

  const token = getToken();

  const response = await fetch(`${apiUrl}/marcas/subir-logo-marca`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al subir logo: ${errorText}`);
  }

  return response.json();
}
