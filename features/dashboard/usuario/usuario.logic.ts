import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import {
  listarUsuariosApi as listarUsuariosService,
  registrarUsuarioApi as registrarUsuarioService,
  actualizarUsuarioApi as actualizarUsuarioService,
} from "./usuario.service";
import { ActualizarUsuarioPayload, RegistrarUsuario } from "./usuario.types";

//! Registrar usuario con validación
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

//! Listar usuarios con validación
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

//! Actualizar usuario con validación
export async function actualizarUsuario(usuarioId: string, payload: ActualizarUsuarioPayload): Promise<void> {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.actualizarUsuarios)) {
    throw new Error("No tienes permisos para actualizar usuarios");
  }
  return actualizarUsuarioService(usuarioId, payload);
}
