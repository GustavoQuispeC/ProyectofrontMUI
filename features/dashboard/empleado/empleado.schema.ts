import { z } from "zod";

export const empleadoSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  apellidos: z.string().trim().min(1, "Los apellidos son obligatorios"),
  tipoDocumento: z.string().min(1, "Seleccione un tipo de documento"),
  numeroDocumento: z.string().trim(),
  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  genero: z.string().min(1, "Seleccione un género"),
  estadoCivil: z.string().min(1, "Seleccione un estado civil"),

  // ✅ .default("") en lugar de .optional()
  nacionalidad: z.string().trim().default(""),
  correo: z.union([z.email("Correo inválido"), z.literal("")]).default(""),
  telefonoMovil: z.union([z.string().regex(/^\d{9}$/, "Debe tener 9 dígitos"), z.literal("")]).default(""),
  direccion: z.string().trim().default(""),

  departamento: z.string().min(1, "Seleccione un departamento"),
  provincia: z.string().min(1, "Seleccione una provincia"),
  distrito: z.string().min(1, "Seleccione un distrito"),

  contactoEmergenciaNombre: z.string().trim().default(""),
  contactoEmergenciaParentesco: z.string().trim().default(""),
  contactoEmergenciaTelefono: z.union([z.string().regex(/^\d{9}$/, "Debe tener 9 dígitos"), z.literal("")]).default(""),
  numeroCuentaBancaria: z.string().trim().default(""),
  bancoNombre: z.string().trim().default(""),
  tiposCuentaBancaria: z.string().trim().default(""),
  cci: z.string().trim().default(""),
  ruc: z.string().trim().default(""),
  numeroESSalud: z.string().trim().default(""),
  sistemaPensiones: z.string().trim().default(""),
  cuspp: z.string().trim().default(""),
  nivelEducativo: z.string().trim().default(""),
  profesionOficio: z.string().trim().default(""),
  fotoUrl: z.string().trim().default(""),

  cargoId: z.string().min(1, "Seleccione un cargo"),
  salario: z.coerce.number({ error: "El salario es obligatorio" }).positive("El salario debe ser mayor a 0.00"),
  tipoContrato: z.string().min(1, "Seleccione un tipo de contrato"),
  tipoJornada: z.string().min(1, "Seleccione un tipo de jornada"),
  fechaIngreso: z.string().min(1, "La fecha de ingreso es obligatoria"),
  observaciones: z.string().trim().default(""),
});

export type EmpleadoForm = z.infer<typeof empleadoSchema>;
