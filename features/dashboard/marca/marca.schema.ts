import { z } from "zod";

export const marcaSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre de la marca es obligatorio"),
  logo: z.string().trim().nullable().default(null),
  isActive: z.boolean().default(true),
});

export type MarcaForm = z.infer<typeof marcaSchema>;
