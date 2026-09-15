import { getAuthUser } from "@/shared/auth/auth.service";
import {
  listarVehiculosApi,
  obtenerVehiculoApi,
  registrarVehiculoApi,
  editarVehiculoApi,
  eliminarVehiculoApi,
} from "./vehiculo.service";
import { RegistrarVehiculoRequest, EditarVehiculoRequest } from "./vehiculo.type";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";

//! Listar vehículos
export async function listarVehiculos() {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.listarVehiculos)) {
    throw new Error("No tienes privilegios para listar vehículos");
  }

  return listarVehiculosApi();
}

//! Obtener vehículo por id
export async function obtenerVehiculo(id: number) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.detalleVehiculo)) {
    throw new Error("No tienes privilegios para ver el detalle de vehículos");
  }

  return obtenerVehiculoApi(id);
}

//! Registrar vehículo
export async function registrarVehiculo(data: RegistrarVehiculoRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.registrarVehiculo)) {
    throw new Error("No tienes privilegios para registrar vehículos");
  }

  return registrarVehiculoApi(data);
}

//! Editar vehículo
export async function editarVehiculo(data: EditarVehiculoRequest) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.editarVehiculo)) {
    throw new Error("No tienes privilegios para editar vehículos");
  }

  return editarVehiculoApi(data);
}

//! Eliminar vehículo (soft delete)
export async function eliminarVehiculo(id: number) {
  const user = getAuthUser();

  if (!user) {
    throw new Error("No autenticado");
  }
  if (!hasPermission(user.rol, permissions.eliminarVehiculo)) {
    throw new Error("No tienes privilegios para eliminar vehículos");
  }

  return eliminarVehiculoApi(id);
}
