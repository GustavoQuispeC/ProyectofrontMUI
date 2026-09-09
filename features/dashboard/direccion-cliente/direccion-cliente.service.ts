import { apiCliente } from "@/lib/api-cliente";
import {
  CrearDireccionClienteRequest,
  ActualizarDireccionClienteRequest,
  DireccionCliente,
} from "./direccion-cliente.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Crear dirección de cliente
export async function crearDireccionClienteApi(payload: CrearDireccionClienteRequest): Promise<DireccionCliente> {
  const response = await apiCliente(`${apiUrl}/direccioncliente`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response as DireccionCliente;
}

//! Listar direcciones por cliente
export async function listarDireccionesPorClienteApi(clienteId: number): Promise<DireccionCliente[]> {
  const response = await apiCliente(`${apiUrl}/direccioncliente/cliente/${clienteId}`, {
    method: "GET",
  });

  return response as DireccionCliente[];
}

//! Obtener dirección por ID
export async function obtenerDireccionClienteApi(id: number): Promise<DireccionCliente> {
  const response = await apiCliente(`${apiUrl}/direccioncliente/${id}`, {
    method: "GET",
  });

  return response as DireccionCliente;
}

//! Actualizar dirección de cliente
export async function actualizarDireccionClienteApi(
  id: number,
  payload: ActualizarDireccionClienteRequest,
): Promise<DireccionCliente> {
  const response = await apiCliente(`${apiUrl}/direccioncliente/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return response as DireccionCliente;
}

//! Eliminar dirección de cliente (soft delete)
export async function eliminarDireccionClienteApi(id: number): Promise<void> {
  await apiCliente(`${apiUrl}/direccioncliente/${id}`, {
    method: "DELETE",
  });
}

//! Establecer dirección como principal
export async function establecerDireccionPrincipalApi(id: number): Promise<DireccionCliente> {
  const response = await apiCliente(`${apiUrl}/direccioncliente/${id}/establecer-principal`, {
    method: "PUT",
  });

  return response as DireccionCliente;
}
