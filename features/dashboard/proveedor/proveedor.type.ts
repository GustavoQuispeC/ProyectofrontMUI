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

export type ListarProveedor = Proveedor;

export type DetalleProveedor = Proveedor;

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

export interface ActualizarProveedorRequest {
  razonSocial: string;
  ruc: string;
  contacto: string | null;
  telefono: string | null;
  correo: string | null;
  isActive: boolean;
}
