import { getAuthUser } from "@/shared/auth/auth.service";
import { registrarFaltaApi as registrarFaltaService } from "./falta.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import {
  listarFaltasPendientesApi as listarFaltasPendientesService,
  aprobarFaltaApi as aprobarFaltaService,
} from "./falta.service";
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

//! Aprobar Falta
export async function aprobarFalta(faltaId: number): Promise<void> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.aprobarFalta)) {
    throw new Error("No tienes privilegios para aprobar faltas");
  }
  return aprobarFaltaService(faltaId);
}
