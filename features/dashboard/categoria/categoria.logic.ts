import { getAuthUser } from "@/shared/auth/auth.service";
import {
  listarCategoriasApi,
  listarCategoriasPublicasApi,
  registrarCategoriaApi,
  subirImagenCategoria,
} from "./categoria.service";
import { RegistrarCategoriaRequest } from "./Categoria.types";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";

export async function listarCategorias() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return listarCategoriasApi();
}

export async function listarCategoriasPublicas() {
  return listarCategoriasPublicasApi();
}

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

export async function subirImagenCategoriaLogic(file: File) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return subirImagenCategoria(file);
}
