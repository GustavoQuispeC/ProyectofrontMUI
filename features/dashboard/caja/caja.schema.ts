import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .min(1, "Campo requerido")
  .or(z.literal(""))
  .or(z.null())
  .transform((value) => value || null);

const montoField = (label: string) =>
  z.coerce
    .number()
    .refine((v) => !Number.isNaN(v), `${label} es requerido`)
    .min(0, `${label} no puede ser negativo`);

export const abrirCajaSchema = z.object({
  tiendaId: z.coerce.number().int().min(1, "Seleccione una tienda"),
  montoApertura: montoField("El monto de apertura"),
  observaciones: optionalString,
});

export type AbrirCajaForm = z.infer<typeof abrirCajaSchema>;

export const cerrarCajaSchema = z.object({
  montoCierreDeclarado: montoField("El monto declarado"),
  observaciones: optionalString,
});

export type CerrarCajaForm = z.infer<typeof cerrarCajaSchema>;
