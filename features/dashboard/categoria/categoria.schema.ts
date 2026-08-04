import { z } from "zod";

export const categoriaSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre de la categoría es obligatorio"),
  descripcion: z.string().trim().nullable().default(null),
  imagen: z.string().trim().nullable().default(null),
  orden: z.coerce.number().int().min(0, "El orden debe ser mayor o igual a 0").default(0),
});

export type CategoriaForm = z.infer<typeof categoriaSchema>;
