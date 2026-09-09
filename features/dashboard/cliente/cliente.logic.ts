import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { buscarClienteApi, crearClienteApi, actualizarClienteApi, listarClientesApi } from "./cliente.service";
import {
  BuscarClienteResponse,
  Cliente,
  CrearClienteRequest,
  ActualizarClienteRequest,
  ListarClientesRequest,
  ListarCliente,
} from "./cliente.type";

//! Buscar cliente por documento con validaciones básicas
export async function buscarCliente(documento: string): Promise<BuscarClienteResponse> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const trimmed = documento.trim();
  if (!trimmed) {
    throw new Error("Ingrese un número de documento");
  }

  if (trimmed.length !== 8 && trimmed.length !== 11) {
    throw new Error("El documento debe tener 8 (DNI) o 11 (RUC) dígitos");
  }

  return buscarClienteApi(trimmed);
}

//! Crear cliente con validación de permisos
export async function crearCliente(payload: CrearClienteRequest): Promise<Cliente> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.registrarCliente)) {
    throw new Error("No tienes permisos para registrar clientes");
  }

  if (!payload.nombre?.trim() && !payload.razonSocial?.trim()) {
    throw new Error("El nombre o la razón social es requerido");
  }

  return crearClienteApi(payload);
}

//! Actualizar cliente con validación de permisos
export async function actualizarCliente(id: number, payload: ActualizarClienteRequest): Promise<Cliente> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.registrarCliente)) {
    throw new Error("No tienes permisos para actualizar clientes");
  }

  if (!payload.nombre?.trim() && !payload.razonSocial?.trim()) {
    throw new Error("El nombre o la razón social es requerido");
  }

  return actualizarClienteApi(id, payload);
}

//! Listar clientes paginados
export async function listarClientes(params: ListarClientesRequest): Promise<{
  clientes: ListarCliente[];
  totalRegistros: number;
}> {
  const user = getAuthUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  if (!hasPermission(user.rol, permissions.listarClientes)) {
    throw new Error("No tienes privilegios para listar clientes");
  }

  return listarClientesApi(params);
}
