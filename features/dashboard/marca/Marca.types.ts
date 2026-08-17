export interface ListarMarca {
  id: number;
  nombre: string;
  logo: string | null;
  isActive: boolean;
  createdAt: string;
  createdByUserName: string | null;
  updatedAt: string | null;
  updatedByUserName: string | null;
}

export interface RegistrarMarcaRequest {
  nombre: string;
  logo: string | null;
}

export interface MarcaRegistrada {
  id: number;
  nombre: string;
  logo: string | null;
}

export interface DetalleMarca {
  id: number;
  nombre: string;
  logo: string | null;
  isActive: boolean;
  createdAt: string;
  createdByUserName: string | null;
  updatedAt: string | null;
  updatedByUserName: string | null;
}

export interface EditarMarcaRequest {
  id: number;
  nombre: string;
  logo: string | null;
  isActive: boolean;
}
