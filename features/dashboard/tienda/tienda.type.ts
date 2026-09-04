export interface Tienda {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string | null;
  isActive: boolean;
  createdAt: string;
  createdByUserName: string | null;
}

export type ListarTienda = Tienda;
