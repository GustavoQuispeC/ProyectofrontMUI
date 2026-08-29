import { ListarProveedor, RegistrarProveedorRequest, ProveedorRegistrado } from "./proveedor.type";
import { apiProveedor } from "@/lib/api-proveedor";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Listar proveedores
export function listarProveedoresApi(): Promise<ListarProveedor[]> {
  return apiProveedor(`${apiUrl}/proveedores`, {
    method: "GET",
  });
}

//! Cambiar estado proveedor (eliminado lógico)
export function cambiarEstadoProveedorApi(id: number): Promise<void> {
  return apiProveedor(`${apiUrl}/proveedores/${id}`, {
    method: "DELETE",
  });
}

//! Registrar proveedor
export function registrarProveedorApi(data: RegistrarProveedorRequest): Promise<ProveedorRegistrado> {
  return apiProveedor(`${apiUrl}/proveedores`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
