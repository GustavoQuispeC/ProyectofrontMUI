export interface EmpleadosListar {
  id: string;
  nombreCompleto: string;
  nombre: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string | null;
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
  fechaIngresoActual: string | null;
  tipoContrato: string;
  tipoJornada: string;
  isActive: boolean;
  createdAt: string | null;
}

// export interface TipoDocumentoListar {
//     id: number;
//     nombre: string;
// }

export interface RegistrarEmpleadoRequest {
  // DATOS PERSONALES
  nombre: string;
  apellidos: string;
  tipoDocumento: number;
  numeroDocumento: string;
  fechaNacimiento: string;
  genero: number;
  estadoCivil: number;
  nacionalidad: string;
  // CONTACTO
  correo: string;
  telefonoMovil: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  // CONTACTO DE EMERGENCIA
  contactoEmergenciaNombre: string;
  contactoEmergenciaParentesco: number | null;
  contactoEmergenciaTelefono: string;
  // CUENTA SUELDO
  bancoSueldo: string;
  cuentaSueldo: string;
  cciSueldo: string;
  // CUENTA CTS
  bancoCTS: string;
  cuentaCTS: string;
  cciCTS: string;
  // OTROS DATOS
  ruc: string;
  sistemaPensiones: number | null;
  cuspp: string;
  // EDUCACIÓN
  nivelEducativo: number | null;
  profesionOficio: string;
  fotoUrl: string;
  // DATOS LABORALES
  cargoId: number;
  salarioBase: number;
  tipoContrato: number | null;
  tipoJornada: number | null;
  fechaIngreso: string;
  observaciones: string;
}

export interface DetalleEmpleadoResponse {
  // DATOS PERSONALES
  id: number;
  nombreCompleto: string;
  nombre: string;
  apellidos: string;
  tipoDocumento: number;
  numeroDocumento: string;
  fechaNacimiento: string;
  edad: number;
  genero: number;
  estadoCivil: number;
  correo: string;
  telefonoMovil: string;
  fotoUrl: string | null;
  nacionalidad: string | null;
  direccion: string | null;
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
  // CONTACTO DE EMERGENCIA
  contactoEmergenciaNombre: string | null;
  contactoEmergenciaParentesco: number | null;
  contactoEmergenciaTelefono: string | null;
  // CUENTA SUELDO
  bancoSueldo: string | null;
  cuentaSueldo: string | null;
  cciSueldo: string | null;
  // CUENTA CTS
  bancoCTS: string | null;
  cuentaCTS: string | null;
  cciCTS: string | null;
  // OTROS DATOS
  ruc: string | null;
  sistemaPensiones: number | null;
  cuspp: string | null;
  // EDUCACIÓN
  nivelEducativo: number | null;
  profesionOficio: string | null;
  // INFORMACIÓN LABORAL
  codigoEmpleado: string | null;
  cargoActual: string | null;
  salarioBase: number | null;
  tipoContrato: number | null;
  tipoJornada: number | null;
  fechaIngreso: string | null;
  fechaEgreso: string | null;
  motivoEgreso: number | null;
  observaciones: string | null;
  // AUDITORÍA
  isActive: boolean;
  createdAt: string;
}

export interface ActualizarEmpleadoRequest {
  // DATOS PERSONALES
  nombre: string;
  apellidos: string;
  tipoDocumento: number;
  numeroDocumento: string;
  fechaNacimiento: string;
  genero: number;
  estadoCivil: number;
  nacionalidad: string;
  // CONTACTO
  correo: string;
  telefonoMovil: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  // CONTACTO DE EMERGENCIA
  contactoEmergenciaNombre: string;
  contactoEmergenciaParentesco: number | null;
  contactoEmergenciaTelefono: string;
  // CUENTA SUELDO
  bancoSueldo: string;
  cuentaSueldo: string;
  cciSueldo: string;
  // CUENTA CTS
  bancoCTS: string;
  cuentaCTS: string;
  ccicts: string;
  // OTROS DATOS
  ruc: string;
  sistemaPensiones: number | null;
  cuspp: string;
  // EDUCACIÓN
  nivelEducativo: number | null;
  profesionOficio: string;
  fotoUrl: string;
  // DATOS LABORALES
  cargoId: number;
  salarioBase: number;
  tipoContrato: number;
  tipoJornada: number;
  observaciones: string;
}

export interface EmpleadoEdicionResponse {
  // DATOS PERSONALES
  id: number;
  nombre: string;
  apellidos: string;
  tipoDocumento: number;
  numeroDocumento: string;
  fechaNacimiento: string;
  genero: number;
  estadoCivil: number;
  nacionalidad: string | null;
  // CONTACTO
  correo: string | null;
  telefonoMovil: string | null;
  direccion: string | null;
  distrito: string | null;
  provincia: string | null;
  departamento: string | null;
  // CONTACTO DE EMERGENCIA
  contactoEmergenciaNombre: string | null;
  contactoEmergenciaParentesco: number | null;
  contactoEmergenciaTelefono: string | null;
  // CUENTA SUELDO
  bancoSueldo: string | null;
  cuentaSueldo: string | null;
  cciSueldo: string | null;
  // CUENTA CTS
  bancoCTS: string | null;
  cuentaCTS: string | null;
  ccicts: string | null;
  // OTROS DATOS
  ruc: string | null;
  sistemaPensiones: number | null;
  cuspp: string | null;
  // EDUCACIÓN
  nivelEducativo: number | null;
  profesionOficio: string | null;
  fotoUrl: string | null;
  // DATOS LABORALES
  cargoId: number | null;
  salarioBase: number | null;
  tipoContrato: number | null;
  tipoJornada: number | null;
  observaciones: string | null;
}

export interface DesactivarEmpleadoRequest {
  motivoEgreso: number;
}

export interface ReactivarEmpleadoRequest {
  cargoId: number;
  salarioBase: number;
  tipoContrato: number;
  tipoJornada: number;
  fechaIngreso: string;
  observaciones: string;
}

export interface EmpleadoAutocomplete {
  id: number;
  nombreCompleto: string;
  correo: string;
}

//* RESPONSE
export interface RegistrarEmpleadoResponse {
  message: string;
  empleadoId: number;
  codigoEmpleado: string;
}
