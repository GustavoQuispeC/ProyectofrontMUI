import {
  ListarProveedor,
  RegistrarProveedorRequest,
  ProveedorRegistrado,
  ActualizarProveedorRequest,
} from "./proveedor.type";
import { apiProveedor } from "@/lib/api-proveedor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Listar proveedores
export function listarProveedoresApi(): Promise<ListarProveedor[]> {
  return apiProveedor(`${apiUrl}/proveedores`, {
    method: "GET",
  });
}

//! Desactivar proveedor (eliminado lógico)
export function cambiarEstadoProveedorApi(id: number): Promise<void> {
  return apiProveedor(`${apiUrl}/proveedores/${id}`, {
    method: "DELETE",
  });
}

//! Activar proveedor (actualización parcial del estado)
export function activarProveedorApi(id: number, data: ActualizarProveedorRequest): Promise<void> {
  return apiProveedor(`${apiUrl}/proveedores/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

//! Registrar proveedor
export function registrarProveedorApi(data: RegistrarProveedorRequest): Promise<ProveedorRegistrado> {
  return apiProveedor(`${apiUrl}/proveedores`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
