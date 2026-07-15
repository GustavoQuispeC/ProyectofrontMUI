import { CondicionFalta, Justificacion } from "./falta.constants";

export interface PendientesFaltas {
  id: number;
  empleadoId: number;
  nombreEmpleado: string;
  fechaInicio: string;
  fechaFin: string;
  justifica: Justificacion;
  observacion: null | string;
  condicion: CondicionFalta;
  aprobadoPor: string | null;
  aprobadoPorNombre: string | null;
  fechaAprobacion: string | null;
  isActive: boolean;
  createdAt: string;
}
export interface RegistrarFalta {
  empleadoId: number;
  fechaInicio: string;
  fechaFin: string;
  justifica: Justificacion;
  condicion: CondicionFalta;
  observacion?: string;
}
