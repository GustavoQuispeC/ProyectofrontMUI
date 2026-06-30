import { apiUsuario } from "@/lib/api-usuario";
import { ListarUsuarios, RegistrarUsuario } from "./usuario.types";

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

//! Función para registrar usuario, token y rol requrido
export async function registrarUsuarioApi(empleadoId: number, payload: RegistrarUsuario): Promise<void> {
  return apiUsuario(`${apiUrl}/Admin/empleados/${empleadoId}/create-user`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

//! Función para actualizar usuario
export async function actualizarUsuarioApi(usuarioId: number, payload: RegistrarUsuario): Promise<void> {
  return apiUsuario(`${apiUrl}/usuarios/${usuarioId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
