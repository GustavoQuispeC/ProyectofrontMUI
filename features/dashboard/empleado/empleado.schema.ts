import { z } from "zod";

export const empleadoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellidos: z.string().min(1, "Los apellidos son obligatorios"),
  tipoDocumento: z.number().min(1, "Seleccione un tipo de documento"),
  numeroDocumento: z.string().length(8, "Debe tener 8 dígitos"),
  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  genero: z.number().min(1, "Seleccione un género"),
  estadoCivil: z.number().min(1, "Seleccione un estado civil"),
  nacionalidad: z.string().nullable(),
  correo: z.string().min(1, "El correo es obligatorio").email("Correo inválido").nullable(),
  telefonoMovil: z.string().min(1, "El teléfono es obligatorio").nullable(),
  direccion: z.string().nullable(),
  departamento: z.string(), // ← sin nullable
  provincia: z.string(), // ← sin nullable
  distrito: z.string(), // ← sin nullable
  contactoEmergenciaNombre: z.string().nullable(),
  contactoEmergenciaParentesco: z.number(),
  contactoEmergenciaTelefono: z.string().nullable(),
  numeroCuentaBancaria: z.string().nullable(),
  bancoNombre: z.string().nullable(),
  tiposCuentaBancaria: z.number(),
  cci: z.string().nullable(),
  ruc: z.string().nullable(),
  numeroESSalud: z.string().nullable(), // ← agregar nullable
  sistemaPensiones: z.number(),
  cuspp: z.string().nullable(),
  nivelEducativo: z.number(),
  profesionOficio: z.string().nullable(),
  fotoUrl: z.string().nullable(),
  cargoId: z.number().min(1, "Seleccione un cargo"),
  salario: z.number().positive("El salario debe ser mayor a 0"),
  tipoContrato: z.number(),
  tipoJornada: z.number(),
  fechaIngreso: z.string().min(1, "La fecha de ingreso es obligatoria"),
  observaciones: z.string().nullable(),
});

//! El tipo se infiere automáticamente del schema
export type EmpleadoForm = z.infer<typeof empleadoSchema>;
