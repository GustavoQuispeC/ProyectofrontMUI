import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .min(1, "Campo requerido")
  .or(z.literal(""))
  .or(z.null())
  .transform((value) => value || null);

export const proveedorSchema = z.object({
  razonSocial: z.string().trim().min(1, "La razón social es obligatoria"),
  ruc: z.string().trim().min(1, "El RUC es obligatorio"),
  contacto: optionalString,
  telefono: optionalString,
  correo: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio")
    .email("El correo no es válido")
    .or(z.literal(""))
    .or(z.null())
    .transform((value) => value || null),
});

export type ProveedorForm = z.infer<typeof proveedorSchema>;
