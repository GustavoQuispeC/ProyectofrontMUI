import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import {
  listarUsuariosApi as listarUsuariosService,
  registrarUsuarioApi as registrarUsuarioService,
} from "./usuario.service";
import { RegistrarUsuario } from "./usuario.types";

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
