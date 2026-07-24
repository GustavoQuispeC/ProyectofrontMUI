import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import {
  listarUsuariosApi as listarUsuariosService,
  registrarUsuarioApi as registrarUsuarioService,
  // actualizarUsuarioApi as actualizarUsuarioService,
  cambiarEstadoUsuarioApi as cambiarEstadoUsuarioService,
  resetPasswordUsuarioApi as resetPasswordUsuarioService,
  changeEmailUsuarioApi as changeEmailUsuarioService,
  changeRoleUsuarioApi as changeRoleUsuarioService,
} from "./usuario.service";
import { RegistrarUsuario } from "./usuario.types";

//! Registrar usuario
export async function registrarUsuario(empleadoId: number, payload: RegistrarUsuario): Promise<void> {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.registrarUsuarios)) {
    throw new Error("No tienes permisos para registrar usuarios");
  }
  return registrarUsuarioService(empleadoId, payload);
}

//! Listar usuarios
export async function listarUsuarios() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.listarUsuarios)) {
    throw new Error("No tienes permisos para listar usuarios");
  }
  return listarUsuariosService();
}

//! Actualizar usuario
// export async function actualizarUsuario(usuarioId: string, payload: ActualizarUsuarioPayload): Promise<void> {
//   const user = getAuthUser();

//   if (!user) {
//     throw new Error("No autenticado");
//   }

//   if (!hasPermission(user.rol, permissions.actualizarUsuarios)) {
//     throw new Error("No tienes permisos para actualizar usuarios");
//   }
//   return actualizarUsuarioService(usuarioId, payload);
// }

//! Cambiar estado
export async function cambiarEstado(usuarioId: string, estado: boolean): Promise<void> {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.cambiarEstadoUsuarios)) {
    throw new Error("No tienes permisos para cambiar el estado de usuarios");
  }
  return cambiarEstadoUsuarioService(usuarioId, estado);
}

//! Resetear contraseña
export async function resetPassword(usuarioId: string, password: string): Promise<void> {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.resetPasswordUsuarios)) {
    throw new Error("No tienes permisos para resetear la contraseña de usuarios");
  }
  return resetPasswordUsuarioService(usuarioId, password);
}

//! Cambiar correo
export async function changeEmail(usuarioId: string, email: string): Promise<void> {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.changeEmailUsuarios)) {
    throw new Error("No tienes permisos para cambiar el correo de usuarios");
  }
  return changeEmailUsuarioService(usuarioId, email);
}

//! Cambiar rol
export async function changeRole(usuarioId: string, role: string): Promise<void> {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.changeRoleUsuarios)) {
    throw new Error("No tienes permisos para cambiar el rol de usuarios");
  }
  return changeRoleUsuarioService(usuarioId, role);
}
