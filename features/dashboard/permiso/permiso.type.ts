export enum Condicion {
  Pendiente = "Pendiente",
  Aprobado = "Aprobado",
  Rechazado = "Rechazado",
}

export interface RegistrarPermiso {
  empleadoId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  lugar: string;
  condicion?: string; // ← opcional
  motivoRechazo?: string; // ← opcional
}

// export interface ListarPermisos {
//   id: number;
//   empleadoId: number;
//   nombreEmpleado: string;
//   fecha: string;
//   horaInicio: string;
//   horaFin: string;
//   duracionMin: number;
//   motivo: string;
//   lugar: string;
//   condicion: string;
//   motivoRechazo: null;
//   aprobadoPor: null | string;
//   aprobadoPorNombre: null | string;
//   fechaAprobacion: Date | null;
//   createdAt: Date;
// }

export interface PendientesPermisos {
  id: number;
  empleadoId: number;
  nombreEmpleado: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  duracionMin: number;
  motivo: string;
  lugar: string;
  condicion: Condicion;
  motivoRechazo: string | null;
  aprobadoPor: string | null;
  aprobadoPorNombre: string | null;
  fechaAprobacion: string | null;
  createdAt: string;
}

export interface ListarPermisoMensual {
  empleadoId: number;

  codigoEmpleado: string;

  nombreCompleto: string;

  cantidadPermisos: number;

  totalHorasPermisos: number;

  permisos: PermisoMensual[];
}

export interface PermisoMensual {
  id: number;

  fecha: string;

  horaInicio: string;

  horaFin: string;

  totalHoras: number;

  motivo: string;

  lugar: string;

  condicion: Condicion;
}
