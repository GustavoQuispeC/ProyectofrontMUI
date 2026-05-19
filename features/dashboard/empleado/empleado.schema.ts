import { z } from "zod";

export const empleadoSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),

  apellidos: z.string().trim().min(1, "Los apellidos son obligatorios"),

  tipoDocumento: z.coerce.number().min(1, "Seleccione un tipo de documento"),

  numeroDocumento: z.string().min(1, "El número de documento es obligatorio"),

  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria"),

  genero: z.coerce.number().min(1, "Seleccione un género"),

  estadoCivil: z.coerce.number().min(1, "Seleccione un estado civil"),

  nacionalidad: z.string().trim().default(""),

  correo: z.string().trim().min(1, "El correo es obligatorio").email("Correo inválido"),

  telefonoMovil: z.union([z.string().regex(/^\d{9}$/, "Debe tener 9 dígitos"), z.literal("")]).default(""),

  direccion: z.string().trim().default(""),

  departamento: z.string().min(1, "Seleccione un departamento"),

  provincia: z.string().min(1, "Seleccione una provincia"),

  distrito: z.string().min(1, "Seleccione un distrito"),

  contactoEmergenciaNombre: z.string().trim().default(""),

  contactoEmergenciaParentesco: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null || val === "0" || val === 0) {
      return null;
    }

    return Number(val);
  }, z.number().nullable()),

  contactoEmergenciaTelefono: z.union([z.string().regex(/^\d{9}$/, "Debe tener 9 dígitos"), z.literal("")]).default(""),

  numeroCuentaBancaria: z.string().trim().default(""),

  bancoNombre: z.string().trim().default(""),

  tipoCuenta: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null || val === "0" || val === 0) {
      return null;
    }

    return Number(val);
  }, z.number().nullable()),

  cci: z.string().trim().default(""),

  ruc: z.string().trim().default(""),

  numeroESSalud: z.string().trim().default(""),

  sistemaPensiones: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null || val === "0" || val === 0) {
      return null;
    }

    return Number(val);
  }, z.number().nullable()),

  cuspp: z.string().trim().default(""),

  nivelEducativo: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null || val === "0" || val === 0) {
      return null;
    }

    return Number(val);
  }, z.number().nullable()),

  profesionOficio: z.string().trim().default(""),

  fotoUrl: z.string().trim().default(""),

  cargoId: z.coerce.number().min(1, "Seleccione un cargo"),

  salario: z.coerce.number().positive("El salario debe ser mayor a 0.00"),

  tipoContrato: z.coerce.number().min(1, "Seleccione un tipo de contrato"),

  tipoJornada: z.coerce.number().min(1, "Seleccione un tipo de jornada"),

  fechaIngreso: z.string().min(1, "La fecha de ingreso es obligatoria"),

  observaciones: z.string().trim().default(""),
});

export type EmpleadoForm = z.infer<typeof empleadoSchema>;
