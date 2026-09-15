import { getAuthUser } from "@/shared/auth/auth.service";
import {
  abrirCajaSesionApi,
  cerrarCajaSesionApi,
  obtenerCajaSesionApi,
  obtenerCajaSesionActivaApi,
  listarCajaSesionesPorTiendaApi,
} from "./caja.service";
import { AbrirCajaSesionRequest, CerrarCajaSesionRequest } from "./caja.type";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";

//! Abrir caja
export async function abrirCajaSesion(data: AbrirCajaSesionRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.abrirCajaSesion)) {
    throw new Error("No tienes privilegios para abrir caja");
  }

  return abrirCajaSesionApi(data);
}

//! Cerrar caja
export async function cerrarCajaSesion(data: CerrarCajaSesionRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.cerrarCajaSesion)) {
    throw new Error("No tienes privilegios para cerrar caja");
  }

  return cerrarCajaSesionApi(data);
}

//! Obtener sesión por id
export async function obtenerCajaSesion(id: number) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.detalleCajaSesion)) {
    throw new Error("No tienes privilegios para ver el detalle de la sesión de caja");
  }

  return obtenerCajaSesionApi(id);
}

//! Obtener sesión abierta de una tienda
export async function obtenerCajaSesionActiva(tiendaId: number) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarCajaSesiones)) {
    throw new Error("No tienes privilegios para ver la sesión de caja");
  }

  return obtenerCajaSesionActivaApi(tiendaId);
}

//! Historial de sesiones de una tienda
export async function listarCajaSesionesPorTienda(tiendaId: number) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarCajaSesiones)) {
    throw new Error("No tienes privilegios para listar las sesiones de caja");
  }

  return listarCajaSesionesPorTiendaApi(tiendaId);
}
