import { apiCliente } from "@/lib/api-cliente";
import {
  BuscarClienteResponse,
  Cliente,
  CrearClienteRequest,
  ActualizarClienteRequest,
  ListarCliente,
  ListarClientesRequest,
} from "./cliente.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Buscar cliente por documento (DNI o RUC)
export async function buscarClienteApi(documento: string): Promise<BuscarClienteResponse> {
  const response = await apiCliente(`${apiUrl}/cliente/buscar/${documento}`, {
    method: "GET",
  });

  return response as BuscarClienteResponse;
}

//! Crear nuevo cliente
export async function crearClienteApi(payload: CrearClienteRequest): Promise<Cliente> {
  const response = await apiCliente(`${apiUrl}/cliente`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response as Cliente;
}

//! Actualizar cliente
export async function actualizarClienteApi(id: number, payload: ActualizarClienteRequest): Promise<Cliente> {
  const response = await apiCliente(`${apiUrl}/cliente/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return response as Cliente;
}

//! Listar clientes paginados
export async function listarClientesApi(params: ListarClientesRequest): Promise<{
  clientes: ListarCliente[];
  totalRegistros: number;
}> {
  const searchParams = new URLSearchParams();

  searchParams.set("pagina", String(params.pagina || 1));
  searchParams.set("tamanoPagina", String(params.tamanoPagina || 50));

  if (params.busqueda) searchParams.set("busqueda", params.busqueda);
  if (params.dni) searchParams.set("dni", params.dni);
  if (params.ruc) searchParams.set("ruc", params.ruc);
  if (params.apellido) searchParams.set("apellido", params.apellido);
  if (params.nombre) searchParams.set("nombre", params.nombre);
  if (params.razonSocial) searchParams.set("razonSocial", params.razonSocial);
  if (typeof params.isActive === "boolean") searchParams.set("isActive", String(params.isActive));

  const query = searchParams.toString();
  const response = await apiCliente(`${apiUrl}/cliente/paginado${query ? `?${query}` : ""}`, {
    method: "GET",
  });

  if (Array.isArray(response)) {
    return { clientes: response as ListarCliente[], totalRegistros: response.length };
  }

  const data = response as Record<string, unknown> | null;
  const clientes = (data?.items ?? data?.clientes ?? data?.data ?? []) as ListarCliente[];
  const totalRegistros =
    (typeof data?.totalCount === "number" && data.totalCount) ||
    (typeof data?.totalRegistros === "number" && data.totalRegistros) ||
    (typeof data?.total === "number" && data.total) ||
    clientes.length;

  return { clientes, totalRegistros };
}
