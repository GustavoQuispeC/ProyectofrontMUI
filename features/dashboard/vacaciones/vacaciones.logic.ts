import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { listarVacacionesApi as listarPermisosMensualService } from "./vacaciones.service";
import { RegistrarVacaciones } from "./vacaciones.type";
import { registrarVacacionesApi as registrarVacacionesService } from "./vacaciones.service";

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

//! Registrar vacaciones
export async function registrarVacaciones(payload: RegistrarVacaciones): Promise<{ vacacionId: number }> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.registrarVacaciones)) {
    throw new Error("No tienes privilegios para registrar vacaciones");
  }
  return registrarVacacionesService(payload);
}
