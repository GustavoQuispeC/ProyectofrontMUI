import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { listarVacacionesApi as listarVacacionesGeneralesService } from "./vacaciones.service";
import { listarVacacionesPendientesApi as listarVacacionesPendientesService } from "./vacaciones.service";
import { RegistrarVacaciones } from "./vacaciones.type";
import { registrarVacacionesApi as registrarVacacionesService } from "./vacaciones.service";
import { aprobarVacacionesApi as aprobarVacacionesService } from "./vacaciones.service";


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

//! Listar vacaciones aprobadas
export async function listarVacacionesGenerales() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.listarVacacionesGenerales)) {
    throw new Error("No tienes privilegios para listar vacaciones generales");
  }
  return listarVacacionesGeneralesService();
}

//! Listar vacaciones pendientes
export async function listarVacacionesPendientes() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.listarVacacionesPendientes)) {
    throw new Error("No tienes privilegios para listar vacaciones pendientes");
  }
  return listarVacacionesPendientesService();
}

//! Aprobar vacaciones
export async function aprobarVacaciones(id:number){
  const user = getAuthUser();
  if(!user){
    throw new Error("No autenticado");
  }
  if(!hasPermission(user.rol, permissions.aprobarVacaciones)){
    throw new Error("No tienes privilegios para aprobar vacaciones");
  }else{
    return aprobarVacacionesService(id);
  }
}
