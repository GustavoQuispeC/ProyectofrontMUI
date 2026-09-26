import { getAuthUser } from "@/shared/auth/auth.service";
import { listarVentasApi, obtenerVentaApi, registrarVentaApi } from "./venta.service";
import { ListarVentasRequest, RegistrarVentaRequest } from "./venta.type";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";

//! Listar ventas
export async function listarVentas(params: ListarVentasRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarVentas)) {
    throw new Error("No tienes privilegios para listar ventas");
  }

  return listarVentasApi(params);
}

//! Obtener venta por id
export async function obtenerVenta(id: number) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarVentas)) {
    throw new Error("No tienes privilegios para ver el detalle de ventas");
  }

  return obtenerVentaApi(id);
}

//! Registrar venta
export async function registrarVenta(data: RegistrarVentaRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.registrarVenta)) {
    throw new Error("No tienes privilegios para registrar ventas");
  }

  return registrarVentaApi(data);
}
