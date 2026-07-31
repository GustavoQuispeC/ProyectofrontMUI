import { getAuthUser } from "@/shared/auth/auth.service";
import { listarCategoriasApi } from "./categoria.service";

export async function listarCategorias() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  return listarCategoriasApi();
}
