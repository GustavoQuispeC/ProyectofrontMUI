import { apiUsuario } from "@/lib/api-usuario";
import { ListarUsuarios, RegistrarUsuario } from "./usuario.types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//!  Listar usuarios
export async function listarUsuariosApi(): Promise<ListarUsuarios[]> {
  return apiUsuario(`${apiUrl}/usuarios`, {
    method: "GET",
  });
}

//! Obtener usuario por ID
export async function getUsuarioByIdApi(userId: string): Promise<ListarUsuarios> {
  return apiUsuario(`${apiUrl}/usuarios/${userId}`, {
    method: "GET",
  });
}

//! Iniciar sesión de usuario
export function loginUsuarioApi(email: string, password: string) {
  return apiUsuario(`${apiUrl}/Auth/login/usuarios`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

//! Registrar usuario
export async function registrarUsuarioApi(empleadoId: number, payload: RegistrarUsuario): Promise<void> {
  return apiUsuario(`${apiUrl}/Admin/empleados/${empleadoId}/create-user`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

//! Actualizar usuario
// export async function actualizarUsuarioApi(usuarioId: string, payload: ActualizarUsuarioPayload): Promise<void> {
//   return apiUsuario(`${apiUrl}/usuarios/${usuarioId}`, {
//     method: "PUT",
//     body: JSON.stringify(payload),
//   });
// }

//! Cambiar estado
export async function cambiarEstadoUsuarioApi(usuarioId: string, isActive: boolean): Promise<void> {
  return apiUsuario(`${apiUrl}/usuarios/${usuarioId}/estado`, {
    method: "PUT",
    body: JSON.stringify({ isActive }),
  });
}

//! Resetear contraseña
export async function resetPasswordUsuarioApi(usuarioId: string, password: string): Promise<void> {
  return apiUsuario(`${apiUrl}/usuarios/${usuarioId}/reset-password`, {
    method: "POST",
    body: JSON.stringify({ newPassword: password }),
  });
}

//! Cambiar correo
export async function changeEmailUsuarioApi(usuarioId: string, email: string): Promise<void> {
  return apiUsuario(`${apiUrl}/usuarios/${usuarioId}/email`, {
    method: "PUT",
    body: JSON.stringify({ newEmail: email }),
  });
}

//! Cambiar rol
export async function changeRoleUsuarioApi(usuarioId: string, role: string): Promise<void> {
  return apiUsuario(`${apiUrl}/usuarios/${usuarioId}/role`, {
    method: "PUT",
    body: JSON.stringify({ roleIds: [role] }),
  });
}
