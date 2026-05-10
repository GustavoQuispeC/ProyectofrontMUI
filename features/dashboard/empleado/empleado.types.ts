export interface EmpleadosListar {
  id: string;
  nombreCompleto: string;
  nombre: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string | Date;
  edad: number;
  genero: string;
  estadoCivil: string;
  correo: string;
  telefonoMovil: string;
  direccion: string;
  fotoUrl: string | null;
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

  nacionalidad: string;
  correo: string;
  telefonoMovil: string;

  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;

  contactoEmergenciaNombre: string;
  contactoEmergenciaParentesco: number | null;
  contactoEmergenciaTelefono: string;

  numeroCuentaBancaria: string;
  bancoNombre: string;

  tipoCuenta: number | null;

  cci: string;
  ruc: string;
  numeroESSalud: string;

  sistemaPensiones: number | null;

  cuspp: string;

  nivelEducativo: number | null;

  profesionOficio: string;
  fotoUrl: string;

  cargoId: number;
  salario: number;

  tipoContrato: number | null;
  tipoJornada: number | null;

  fechaIngreso: string;

  observaciones: string;
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
