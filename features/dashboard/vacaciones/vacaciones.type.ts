export enum EstadoVacacion {
  Pendiente = "Pendiente",
  Aprobado = "Aprobado",
  Cancelado = "Cancelado",
}

export enum EstadoPeriodoVacacional {
  Incompleto = "Incompleto",
  Completo = "Completo",
}

export interface ListarEmpleadoVacaciones {
  empleadoId: number;
  codigoEmpleado: string;
  nombreCompleto: string;
  fechaIngreso: string;

  diasTotalesDisponibles: number;
  cantidadPeriodos: number;

  periodosVacacionales: PeriodoVacacional[];
}

export type VacacionesIdResumen = ListarEmpleadoVacaciones;

export interface PeriodoVacacional {
  vacacionSaldoId: number;
  periodoInicio: string;
  periodoFin: string;
  diasAcumulados: number;
  diasUsados: number;
  diasDisponibles: number;
  cantidadDomingosAcumulados: number;
  porcentajeAcumulado: number;
  cantidadVacaciones: number;
  estado: EstadoPeriodoVacacional;
  vacaciones: Vacacion[];
}
export interface Vacacion {
  vacacionId: number;
  fechaInicio: string;
  fechaFin: string;
  diasCalendario: number;
  cantidadDomingos: number;
  observacion: string;
  estado: EstadoVacacion;
  aprobadoPor: string | null;
  fechaSolicitud: string;
  fechaAprobacion: string | null;
}

export interface RegistrarVacaciones {
  empleadoId: number;
  fechaInicio: string;
  fechaFin: string;
  observacion: string | null;
}
