import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import { getAuthUser } from "@/shared/auth/auth.service";
import {
  asignarConductorVehiculoApi,
  completarDespachoApi,
  listarConductoresDespachoApi,
  listarDespachosPorVentaApi,
  marcarDespachoEnRutaApi,
} from "./despacho.service";
import { AsignarConductorVehiculoRequest, EnRutaRequest } from "./despacho.type";

export async function listarDespachosPorVenta(ventaId: number) {
  const user = getAuthUser();

  if (!user) throw new Error("No autenticado");
  if (!hasPermission(user.rol, permissions.listarVentas)) {
    throw new Error("No tienes privilegios para listar despachos");
  }

  return listarDespachosPorVentaApi(ventaId);
}

export async function listarConductoresDespacho() {
  const user = getAuthUser();

  if (!user) throw new Error("No autenticado");
  if (!hasPermission(user.rol, permissions.listarVentas)) {
    throw new Error("No tienes privilegios para listar conductores");
  }

  return listarConductoresDespachoApi();
}

export async function asignarConductorVehiculo(id: number, data: AsignarConductorVehiculoRequest) {
  const user = getAuthUser();

  if (!user) throw new Error("No autenticado");
  if (!hasPermission(user.rol, permissions.listarVentas)) {
    throw new Error("No tienes privilegios para asignar el despacho");
  }

  return asignarConductorVehiculoApi(id, data);
}

export async function marcarDespachoEnRuta(id: number, data?: EnRutaRequest) {
  const user = getAuthUser();

  if (!user) throw new Error("No autenticado");
  if (!hasPermission(user.rol, permissions.listarVentas)) {
    throw new Error("No tienes privilegios para poner el despacho en ruta");
  }

  return marcarDespachoEnRutaApi(id, data);
}

export async function completarDespacho(id: number) {
  const user = getAuthUser();

  if (!user) throw new Error("No autenticado");
  if (!hasPermission(user.rol, permissions.listarVentas)) {
    throw new Error("No tienes privilegios para completar el despacho");
  }

  return completarDespachoApi(id);
}
