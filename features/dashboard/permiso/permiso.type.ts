export type Condicion = "Pendiente" | "Aprobado" | "Rechazado";

export interface RegistrarPermiso {
  empleadoId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  lugar: string;
}

export interface ListarPermisos {
  id: number;
  empleadoId: number;
  nombreEmpleado: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  duracionMin: number;
  motivo: string;
  lugar: string;
  condicion: string;
  motivoRechazo: null;
  aprobadoPor: null | string;
  aprobadoPorNombre: null | string;
  fechaAprobacion: Date | null;
  createdAt: Date;
}
