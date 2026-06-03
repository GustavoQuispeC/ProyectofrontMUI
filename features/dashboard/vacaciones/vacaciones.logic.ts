import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { listarVacacionesApi as listarPermisosMensualService } from "./vacaciones.service";

//! Listar vacaciones
export async function listarVacacionesGenerales() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.listarVacacionesGenerales)) {
    throw new Error("No tienes privilegios para listar vacaciones generales");
  }
  return listarPermisosMensualService();
}
