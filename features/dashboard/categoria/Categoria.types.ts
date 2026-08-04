export interface ListarCategoria {
  id: number;
  nombre: string;
  imagen: string | null;
  orden: number;
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
