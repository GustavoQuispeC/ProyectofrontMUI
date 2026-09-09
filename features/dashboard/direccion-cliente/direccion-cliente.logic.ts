import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import {
  crearDireccionClienteApi,
  listarDireccionesPorClienteApi,
  obtenerDireccionClienteApi,
  actualizarDireccionClienteApi,
  eliminarDireccionClienteApi,
  establecerDireccionPrincipalApi,
} from "./direccion-cliente.service";
import {
  CrearDireccionClienteRequest,
  ActualizarDireccionClienteRequest,
  DireccionCliente,
} from "./direccion-cliente.type";

//! Crear dirección de cliente
export async function crearDireccionCliente(payload: CrearDireccionClienteRequest): Promise<DireccionCliente> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.registrarCliente)) {
    throw new Error("No tienes permisos para registrar direcciones");
  }

  if (!payload.direccion.trim()) {
    throw new Error("La dirección es requerida");
  }

  return crearDireccionClienteApi(payload);
}

//! Listar direcciones por cliente
export async function listarDireccionesPorCliente(clienteId: number): Promise<DireccionCliente[]> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.listarClientes)) {
    throw new Error("No tienes permisos para listar direcciones");
  }

  return listarDireccionesPorClienteApi(clienteId);
}

//! Obtener dirección por ID
export async function obtenerDireccionCliente(id: number): Promise<DireccionCliente> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.listarClientes)) {
    throw new Error("No tienes permisos para ver direcciones");
  }

  return obtenerDireccionClienteApi(id);
}

//! Actualizar dirección de cliente
export async function actualizarDireccionCliente(
  id: number,
  payload: ActualizarDireccionClienteRequest,
): Promise<DireccionCliente> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.registrarCliente)) {
    throw new Error("No tienes permisos para actualizar direcciones");
  }

  if (!payload.direccion.trim()) {
    throw new Error("La dirección es requerida");
  }

  return actualizarDireccionClienteApi(id, payload);
}

//! Eliminar dirección de cliente (soft delete)
export async function eliminarDireccionCliente(id: number): Promise<void> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.registrarCliente)) {
    throw new Error("No tienes permisos para eliminar direcciones");
  }

  return eliminarDireccionClienteApi(id);
}

//! Establecer dirección como principal
export async function establecerDireccionPrincipal(id: number): Promise<DireccionCliente> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.registrarCliente)) {
    throw new Error("No tienes permisos para establecer la dirección principal");
  }

  return establecerDireccionPrincipalApi(id);
}
