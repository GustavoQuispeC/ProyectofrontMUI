export type Condicion = "Pendiente" | "Aprobado" | "Rechazado";

export interface RegistrarPermiso {
  id: number;
  empleadoId: number;
  nombreEmpleado: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  duracionMin: string;
  motivo: string;
  lugar: string;
  condicion: Condicion;
  motivoRechazo?: string;
  aprobadoPor?: string;
  aprobadoPorNombre?: string;
  fechaAprobacion?: string;
  createdAt: string;
}
