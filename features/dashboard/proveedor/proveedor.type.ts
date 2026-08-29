export interface Proveedor {
  id: number;
  razonSocial: string;
  ruc: string;
  contacto: string | null;
  telefono: string | null;
  correo: string | null;
  isActive: boolean;
  createdAt: string;
  createdByUserName: string | null;
  updatedAt: string | null;
  updatedByUserName: string | null;
}

export interface ListarProveedor extends Proveedor {}

export interface DetalleProveedor extends Proveedor {}

export interface RegistrarProveedorRequest {
  razonSocial: string;
  ruc: string;
  contacto: string | null;
  telefono: string | null;
  correo: string | null;
}

export interface ProveedorRegistrado {
  id: number;
  razonSocial: string;
  ruc: string;
  contacto: string | null;
  telefono: string | null;
  correo: string | null;
}
