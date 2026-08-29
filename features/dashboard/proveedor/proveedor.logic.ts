import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { listarProveedoresApi, cambiarEstadoProveedorApi, registrarProveedorApi } from "./proveedor.service";
import { RegistrarProveedorRequest } from "./proveedor.type";

//! Listar proveedores
export async function listarProveedores() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarProveedores)) {
    throw new Error("No tienes privilegios para listar proveedores");
  }

  return listarProveedoresApi();
}

//! Cambiar estado proveedor
export async function cambiarEstadoProveedor(id: number) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.registrarProveedor)) {
    throw new Error("No tienes privilegios para cambiar el estado de proveedores");
  }

  return cambiarEstadoProveedorApi(id);
}

//! Registrar proveedor
export async function registrarProveedor(data: RegistrarProveedorRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.registrarProveedor)) {
    throw new Error("No tienes privilegios para registrar proveedores");
  }

  return registrarProveedorApi(data);
}
