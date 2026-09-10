import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { crearSalidaApi, listarSalidasApi } from "./salida.service";
import { CrearSalidaRequest, ListarSalidasRequest, Salida } from "./salida.type";

//! Crear salida con validación de permisos
export async function crearSalida(payload: CrearSalidaRequest): Promise<Salida> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.registrarSalida)) {
    throw new Error("No tienes permisos para registrar salidas");
  }

  if (!payload.tiendaOrigenId) {
    throw new Error("La tienda de origen es requerida");
  }

  if (!payload.origen) {
    throw new Error("El origen es requerido");
  }

  if (payload.origen === 2 && !payload.empleadoSolicitaId) {
    throw new Error("El empleado solicitante es requerido para uso interno");
  }

  if (!payload.detalles.length) {
    throw new Error("Debe agregar al menos un producto");
  }

  return crearSalidaApi(payload);
}

//! Listar salidas con validación de permisos
export async function listarSalidas(params: ListarSalidasRequest): Promise<{
  salidas: import("./salida.type").ListarSalida[];
  totalRegistros: number;
}> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.listarSalidas)) {
    throw new Error("No tienes permisos para listar salidas");
  }

  return listarSalidasApi(params);
}
