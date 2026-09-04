import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { listarTiendasApi } from "./tienda.service";

//! Listar tiendas
export async function listarTiendas() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarTiendas)) {
    throw new Error("No tienes privilegios para listar tiendas");
  }

  return listarTiendasApi();
}
