import { getAuthUser } from "@/shared/auth/auth.service";
import { listarMarcasApi, obtenerMarcaApi, registrarMarcaApi, editarMarcaApi, subirLogoMarca } from "./marca.service";
import { RegistrarMarcaRequest, EditarMarcaRequest } from "./Marca.types";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";

//! Listar marcas
export async function listarMarcas() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarMarcas)) {
    throw new Error("No tienes privilegios para listar marcas");
  }

  return listarMarcasApi();
}

//! Obtener marca por id
export async function obtenerMarca(id: number) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.detalleMarca)) {
    throw new Error("No tienes privilegios para ver el detalle de marcas");
  }

  return obtenerMarcaApi(id);
}

//! Registrar marca
export async function registrarMarca(data: RegistrarMarcaRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.registrarMarca)) {
    throw new Error("No tienes privilegios para registrar marcas");
  }

  return registrarMarcaApi(data);
}

//! Editar marca
export async function editarMarca(data: EditarMarcaRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.editarMarca)) {
    throw new Error("No tienes privilegios para editar marcas");
  }

  return editarMarcaApi(data);
}

//! Subir logo de marca
export async function subirLogoMarcaLogic(file: File) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return subirLogoMarca(file);
}
