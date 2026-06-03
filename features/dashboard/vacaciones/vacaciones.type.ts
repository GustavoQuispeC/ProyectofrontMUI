export enum EstadoVacacion {
  Pendiente = 1,
  Aprobado = 2,
  Rechazado = 3,
  Cancelado = 4,
}

export enum EstadoPeriodoVacacional {
  Incompleto = "Incompleto",
  Completo = "Completo",
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

export interface PeriodoVacacional {
  vacacionSaldoId: number;

  periodoInicio: string;
  periodoFin: string;

  fechaGeneracion: string;

  diasAsignados: number;
  diasUsados: number;
  diasDisponibles: number;

  cantidadDomingosAcumulados: number;

  porcentajeConsumido: number;

  cantidadVacaciones: number;

  estado: EstadoPeriodoVacacional;

  vacaciones: Vacacion[];
}

export interface ListarEmpleadoVacaciones {
  empleadoId: number;

  codigoEmpleado: string;

  nombreCompleto: string;

  fechaIngreso: string;

  diasTotalesDisponibles: number;
  diasTotalesUsados: number;
  diasTotalesAsignados: number;

  cantidadPeriodos: number;

  cantidadVacaciones: number;

  porcentajeConsumido: number;

  periodosVacacionales: PeriodoVacacional[];
}

export type EmpleadosVacacionesResponse = ListarEmpleadoVacaciones[];
