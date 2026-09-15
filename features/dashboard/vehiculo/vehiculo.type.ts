export interface ListarVehiculo {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface DetalleVehiculo {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface RegistrarVehiculoRequest {
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
}

export interface EditarVehiculoRequest {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  isActive: boolean;
}

export interface VehiculoRegistrado {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}
