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

export interface FaltaMensualItem {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  totalDias: number;
  justifica: Justificacion;
  observacion: string | null;
  condicion: CondicionFalta;
}

export interface ListarFaltaMensual {
  empleadoId: number;
  codigoEmpleado: string;
  nombreCompleto: string;
  cantidadFaltas: number;
  totalDiasFaltas: number;
  faltas: FaltaMensualItem[];
}
