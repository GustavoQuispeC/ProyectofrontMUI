import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { listarInventarioApi } from "./inventario.service";
import { ListarInventario, ListarInventarioRequest } from "./inventario.type";

//! Listar inventario
export async function listarInventario(params: ListarInventarioRequest): Promise<{
  inventario: ListarInventario[];
  totalRegistros: number;
}> {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarInventario)) {
    throw new Error("No tienes privilegios para listar inventario");
  }

  return listarInventarioApi(params);
}
