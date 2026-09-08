import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .min(1, "Campo requerido")
  .or(z.literal(""))
  .or(z.null())
  .transform((value) => value || null);

export const clienteSchema = z
  .object({
    nombre: optionalString,
    apellido: optionalString,
    razonSocial: optionalString,
    numeroDni: optionalString,
    numeroRuc: optionalString,
    correo: z
      .string()
      .trim()
      .min(1, "El correo es requerido")
      .email("El correo no es válido")
      .or(z.literal(""))
      .or(z.null())
      .transform((value) => value || null),
    telefono: optionalString,
  })
  .refine((data) => data.nombre || data.razonSocial, {
    message: "Debe ingresar nombre o razón social",
    path: ["nombre"],
  })
  .refine((data) => data.numeroDni || data.numeroRuc, { message: "Debe ingresar DNI o RUC", path: ["numeroDni"] });

export type ClienteForm = z.infer<typeof clienteSchema>;
