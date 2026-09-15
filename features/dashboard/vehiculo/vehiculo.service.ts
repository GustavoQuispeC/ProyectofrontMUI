import { apiVehiculo } from "@/lib/api-vehiculo";
import {
  ListarVehiculo,
  DetalleVehiculo,
  RegistrarVehiculoRequest,
  EditarVehiculoRequest,
  VehiculoRegistrado,
} from "./vehiculo.type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//! Listar vehículos
export function listarVehiculosApi(): Promise<ListarVehiculo[]> {
  return apiVehiculo(`${apiUrl}/vehiculos`, {
    method: "GET",
  });
}

//! Obtener vehículo por id
export function obtenerVehiculoApi(id: number): Promise<DetalleVehiculo> {
  return apiVehiculo(`${apiUrl}/vehiculos/${id}`, {
    method: "GET",
  });
}

//! Registrar vehículo
export function registrarVehiculoApi(data: RegistrarVehiculoRequest): Promise<VehiculoRegistrado> {
  return apiVehiculo(`${apiUrl}/vehiculos`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

//! Editar vehículo
export function editarVehiculoApi(data: EditarVehiculoRequest): Promise<VehiculoRegistrado> {
  return apiVehiculo(`${apiUrl}/vehiculos/${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

//! Eliminar vehículo (soft delete)
export function eliminarVehiculoApi(id: number): Promise<void> {
  return apiVehiculo(`${apiUrl}/vehiculos/${id}`, {
    method: "DELETE",
  });
}
