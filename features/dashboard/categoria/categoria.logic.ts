import { getAuthUser } from "@/shared/auth/auth.service";
import {
  listarCategoriasApi,
  listarCategoriasPublicasApi,
  obtenerCategoriaApi,
  registrarCategoriaApi,
  editarCategoriaApi,
  subirImagenCategoria,
} from "./categoria.service";
import { RegistrarCategoriaRequest, EditarCategoriaRequest } from "./Categoria.types";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";

//! Listar categorias
export async function listarCategorias() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarCategorias)) {
    throw new Error("No tienes privilegios para listar categorias");
  }

  return listarCategoriasApi();
}

//! Listar categorias publicas
export async function listarCategoriasPublicas() {
  return listarCategoriasPublicasApi();
}

//! Obtener categoria por id
export async function obtenerCategoria(id: number) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.detalleCategoria)) {
    throw new Error("No tienes privilegios para ver el detalle de categorias");
  }

  return obtenerCategoriaApi(id);
}

//! Registrar categoria
export async function registrarCategoria(data: RegistrarCategoriaRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.registrarCategoria)) {
    throw new Error("No tienes privilegios para registrar categorias");
  }

  return registrarCategoriaApi(data);
}

//! Editar categoria
export async function editarCategoria(data: EditarCategoriaRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.editarCategoria)) {
    throw new Error("No tienes privilegios para editar categorias");
  }

  return editarCategoriaApi(data);
}

//! Subir imagen de categoria
export async function subirImagenCategoriaLogic(file: File) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return subirImagenCategoria(file);
}
