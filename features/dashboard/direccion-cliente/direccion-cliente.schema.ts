import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .min(1, "Campo requerido")
  .or(z.literal(""))
  .or(z.null())
  .transform((value) => value || null);

export const direccionClienteSchema = z.object({
  direccion: z.string().trim().min(1, "La dirección es requerida"),
  referencia: optionalString,
  distrito: optionalString,
  provincia: optionalString,
  departamento: optionalString,
  esPrincipal: z.boolean().default(true),
});

export type DireccionClienteForm = z.infer<typeof direccionClienteSchema>;
