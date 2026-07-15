import { getAuthUser } from "@/shared/auth/auth.service";
import { registrarFaltaApi as registrarFaltaService } from "./falta.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { listarFaltasPendientesApi as listarFaltasPendientesService } from "./falta.service";
import { RegistrarFalta } from "./falta.type";

//! Registrar permiso
export async function registrarFalta(payload: RegistrarFalta): Promise<{ faltaId: number }> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.registrarFalta)) {
    throw new Error("No tienes privilegios para registrar faltas");
  }
  return registrarFaltaService(payload);
}

//! Listar faltas pendientes
export async function listarFaltasPendientes() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.listarFaltasPendientes)) {
    throw new Error("No tienes privilegios para listar faltas pendientes");
  }
  return listarFaltasPendientesService();
}
