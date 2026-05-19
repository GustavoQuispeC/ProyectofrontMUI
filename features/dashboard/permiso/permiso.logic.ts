import { getAuthUser } from "@/shared/auth/auth.service";
import { RegistrarPermiso } from "./permiso.type";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { registrarPermisoApi as registrarPermisoService } from "./permiso.service";

export async function registrarPermiso(payload: RegistrarPermiso): Promise<{ permisoId: number }> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.registrarPermiso)) {
    throw new Error("No tienes permisos para registrar permisos");
  }
  return registrarPermisoService(payload);
}
