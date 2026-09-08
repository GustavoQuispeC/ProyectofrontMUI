export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  razonSocial: string | null;
  numeroDni: string | null;
  numeroRuc: string | null;
  correo: string;
  telefono: string;
  nombreCompleto: string;
  createdAt: string;
  isActive: boolean;
}

export interface ClienteDatosApi {
  dni?: string;
  ruc?: string;
  nombre?: string;
  nombres?: string;
  apellido?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  razonSocial?: string;
  direccion?: string;
  ubigeo?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  estado?: string;
  condicionDomicilio?: string;
}

export interface BuscarClienteResponse {
  existe: boolean;
  cliente: Cliente | null;
  datosApi: ClienteDatosApi | null;
}

export interface CrearClienteRequest {
  nombre?: string;
  apellido?: string;
  razonSocial?: string | null;
  numeroDni?: string | null;
  numeroRuc?: string | null;
  correo?: string;
  telefono?: string;
}

export type ListarCliente = Cliente;

export interface ListarClientesRequest {
  busqueda?: string;
  dni?: string;
  ruc?: string;
  apellido?: string;
  nombre?: string;
  razonSocial?: string;
  isActive?: boolean;
  pagina: number;
  tamanoPagina: number;
}
