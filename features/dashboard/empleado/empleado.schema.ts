import { z } from "zod";

const nullableSelect = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined || value === 0 || value === "0") {
    return null;
  }

  return Number(value);
}, z.number().nullable());

export const empleadoSchema = z.object({
  // DATOS PERSONALES
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  apellidos: z.string().trim().min(1, "Los apellidos son obligatorios"),
  tipoDocumento: z.coerce.number().min(1, "Seleccione un tipo de documento"),
  numeroDocumento: z.string().trim().min(1, "El número de documento es obligatorio"),
  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  genero: z.coerce.number().min(1, "Seleccione un género"),
  estadoCivil: z.coerce.number().min(1, "Seleccione un estado civil"),
  nacionalidad: z.string().trim().default(""),
  // CONTACTO
  correo: z.string().trim().min(1, "El correo es obligatorio").email("Correo inválido"),
  telefonoMovil: z.string().regex(/^\d{9}$/, "El teléfono móvil debe contener exactamente 9 dígitos"),
  direccion: z.string().trim().min(1, "La dirección es obligatoria"),
  departamento: z.string().min(1, "Seleccione un departamento"),
  provincia: z.string().min(1, "Seleccione una provincia"),
  distrito: z.string().min(1, "Seleccione un distrito"),
  // CONTACTO DE EMERGENCIA
  contactoEmergenciaNombre: z.string().trim().default(""),
  contactoEmergenciaParentesco: nullableSelect,
  contactoEmergenciaTelefono: z.union([z.string().regex(/^\d{9}$/, "Debe tener 9 dígitos"), z.literal("")]).default(""),
  // CUENTA SUELDO
  bancoSueldo: z.string().trim().default(""),
  cuentaSueldo: z.string().trim().default(""),
  cciSueldo: z.string().trim().default(""),
  // CUENTA CTS
  bancoCTS: z.string().trim().default(""),
  cuentaCTS: z.string().trim().default(""),
  cciCTS: z.string().trim().default(""),
  // OTROS DATOS
  ruc: z.string().trim().default(""),
  sistemaPensiones: nullableSelect,
  cuspp: z.string().trim().default(""),
  // EDUCACIÓN
  nivelEducativo: nullableSelect,
  profesionOficio: z.string().trim().default(""),
  fotoUrl: z.string().trim().default(""),
  // DATOS LABORALES
  cargoId: z.coerce.number().min(1, "Seleccione un cargo"),
  salarioBase: z.coerce.number().positive("El salario base debe ser mayor a 0.00"),
  tipoContrato: z.coerce.number().min(1, "Seleccione un tipo de contrato"),
  tipoJornada: z.coerce.number().min(1, "Seleccione un tipo de jornada"),
  fechaIngreso: z.string().min(1, "La fecha de ingreso es obligatoria"),
  observaciones: z.string().trim().default(""),
});

export type EmpleadoForm = z.infer<typeof empleadoSchema>;

export const empleadoEdicionSchema = empleadoSchema.omit({
  fechaIngreso: true,
});

export type EmpleadoEdicionForm = z.infer<typeof empleadoEdicionSchema>;
