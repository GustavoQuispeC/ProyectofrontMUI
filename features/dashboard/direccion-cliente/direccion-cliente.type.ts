export interface DireccionCliente {
  id: number;
  clienteId: number;
  direccion: string;
  referencia: string | null;
  distrito: string | null;
  provincia: string | null;
  departamento: string | null;
  esPrincipal: boolean;
  createdAt: string;
  isActive: boolean;
}

export interface CrearDireccionClienteRequest {
  clienteId: number;
  direccion: string;
  referencia?: string | null;
  distrito?: string | null;
  provincia?: string | null;
  departamento?: string | null;
  esPrincipal: boolean;
}

export interface ActualizarDireccionClienteRequest {
  direccion: string;
  referencia?: string | null;
  distrito?: string | null;
  provincia?: string | null;
  departamento?: string | null;
  esPrincipal: boolean;
}
