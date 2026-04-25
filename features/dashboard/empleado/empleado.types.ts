export interface EmpleadosListar {
  id: string;
  nombreCompleto: string;
  nombre: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: Date;
  edad: number;
  genero: string;
  estadoCivil: string;
  correo: string;
  telefonoMovil: string;
  direccion: string;
  fotoUrl: null;
  codigoEmpleado: string;
  cargoActual: string;
  salarioActual: number;
  fechaIngresoActual: Date;
  tipoContrato: string;
  tipoJornada: string;
  isActive: boolean;
  createdAt: Date;
}

export interface TipoDocumentoListar {
  id: number;
  nombre: string;
}

export interface RegistarEmpleado {
  nombre: string;
  apellidos: string;
  tipoDocumento: number;
  numeroDocumento: string;
  fechaNacimiento: string;
  genero: number;
  estadoCivil: number;
  nacionalidad: string | null;
  correo: string | null;
  telefonoMovil: string | null;
  direccion: string | null;
  distrito: string;
  provincia: string;
  departamento: string;
  contactoEmergenciaNombre: string | null;
  contactoEmergenciaParentesco: number;
  contactoEmergenciaTelefono: string | null;
  numeroCuentaBancaria: string | null;
  bancoNombre: string | null;
  tiposCuentaBancaria: number;
  cci: string | null;
  ruc: string | null;
  numeroESSalud: string | null;
  sistemaPensiones: number;
  cuspp: string | null;
  nivelEducativo: number;
  profesionOficio: string | null;
  fotoUrl: string | null;
  cargoId: number;
  salario: number;
  tipoContrato: number;
  tipoJornada: number;
  fechaIngreso: string;
  observaciones: string | null;
}

export interface VerEmpleado {
  id: string;
  nombreCompleto: string;
  nombre: string;
  apellidos: string;
  genero: string;
  estadoCivil: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  edad: number;
  correo: string;
  telefonoMovil: string;
  fotoUrl: string | null;
  nacionalidad: string;
  direccion: string | null;
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
  contactoEmergenciaNombre: string | null;
  contactoEmergenciaTelefono: string | null;
  contactoEmergenciaParentesco: string | null;
  bancoNombre: string | null;
  numeroCuentaBancaria: string | null;
  tiposCuentaBancaria: string | null;
  cci: string | null;
  numeroEssalud: string | null;
  sistemaPensiones: string | null;
  cuspp: string | null;
  nivelEducativo: string | null;
  profesionOficio: string | null;
  codigoEmpleado: string;
  cargoActual: string;
  salarioActual: number;
  fechaIngresoActual: string;
  fechaEgreso: string | null;
  observaciones: string | null;
  tipoContrato: string | null;
  tipoJornada: string | null;
  isActive: boolean;
}
