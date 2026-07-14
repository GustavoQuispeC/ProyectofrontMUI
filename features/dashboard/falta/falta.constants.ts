export enum Condicion {
  Pendiente = "Pendiente",
  Aprobado = "Aprobado",
  Rechazado = "Cancelado",
}

export enum Justificacion {
  Si = "Si",
  No = "No",
}

export interface RegistrarFalta {
  empleadoId: number;
  fechaInicio: string;
  fechaFin: string;
  justifica: string;
  condicion: string;
  observacion?: string;
}
