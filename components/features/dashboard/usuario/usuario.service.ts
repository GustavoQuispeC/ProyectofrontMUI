import { apiUsuario } from "@/lib/api-usuario";
import { ListarUsuarios } from "@/features/usuario/usuario.types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//!  Listar usuarios
export async function listarUsuariosApi(): Promise<ListarUsuarios[]> {
  return apiUsuario(`${apiUrl}/Usuarios`, {
    method: "GET",
  });
}

//! Función para iniciar sesión de usuario
export function loginUsuarioApi(email: string, password: string) {
  return apiUsuario(`${apiUrl}/Auth/login/usuario`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
