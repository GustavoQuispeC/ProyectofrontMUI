import { getAuthUser } from "@/shared/auth/auth.service";
import {
  listarUsuariosApi as listarUsuariosService,
  registrarUsuarioApi as registrarUsuarioService,
} from "./usuario.service";
import { RegistrarUsuario } from "./usuario.types";

//! registrar usuario con validación
export async function registrarUsuario(empleadoId: number, payload: RegistrarUsuario): Promise<void> {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  if (user.rol !== "Admin" && user.rol !== "Supervisor") {
    throw new Error("No tienes permisos para registrar usuarios");
  }

  return registrarUsuarioService(empleadoId, payload);
}

//! Función para listar usuarios con validación de autenticación
export async function listarUsuarios() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return listarUsuariosService();
}
