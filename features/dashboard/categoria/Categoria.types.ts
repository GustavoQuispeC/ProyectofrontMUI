export interface ListarCategoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagen: string | null;
  orden: number;
  createdAt: string;
  createdByUserName: string;
  isActive: boolean;
}

export interface RegistrarCategoriaRequest {
  nombre: string;
  descripcion: string | null;
  imagen: string | null;
  orden: number;
}

export interface CategoriaRegistrada {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagen: string | null;
  orden: number;
}

export interface DetalleCategoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagen: string | null;
  orden: number;
  isActive: boolean;
  createdAt: string;
  createdByUserName: string;
  updatedAt: string | null;
  updatedByUserName: string | null;
}

export interface EditarCategoriaRequest {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagen: string | null;
  orden: number;
  isActive: boolean;
}
