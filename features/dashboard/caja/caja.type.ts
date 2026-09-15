export interface AbrirCajaSesionRequest {
  tiendaId: number;
  montoApertura: number;
  observaciones?: string | null;
}

export interface CerrarCajaSesionRequest {
  cajaSesionId: number;
  montoCierreDeclarado: number;
  observaciones?: string | null;
}

export interface CajaSesion {
  id: number;
  tiendaId: number;
  tiendaNombre?: string | null;
  empleadoAperturaId: number;
  empleadoAperturaNombre?: string | null;
  estadoCajaSesionId?: number;
  estadoNombre?: string | null;
  montoApertura: number;
  montoCierreEsperado?: number | null;
  montoCierreDeclarado?: number | null;
  diferencia?: number | null;
  totalEfectivo?: number | null;
  totalDepositoBancario?: number | null;
  totalCredito?: number | null;
  totalIngresos?: number | null;
  totalEgresos?: number | null;
  observaciones?: string | null;
  fechaApertura?: string | null;
  fechaCierre?: string | null;
  isActive?: boolean;
  createdAt?: string | null;
}
