export enum CondicionFalta {
  Pendiente = 1,
  Aprobado = 2,
  Cancelado = 3,
}

export enum Justificacion {
  Si = 1,
  No = 2,
}

export interface RegistrarFalta {
  empleadoId: number;
  fechaInicio: string;
  fechaFin: string;
  justifica: Justificacion;
  condicion: CondicionFalta;
  observacion?: string;
}
