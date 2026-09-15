import { z } from "zod";

export const vehiculoSchema = z.object({
  placa: z.string().trim().min(1, "La placa es obligatoria").max(10, "La placa no puede tener más de 10 caracteres"),
  marca: z.string().trim().min(1, "La marca es obligatoria"),
  modelo: z.string().trim().min(1, "El modelo es obligatorio"),
  anio: z.coerce
    .number()
    .int("El año debe ser un número entero")
    .min(1900, "El año no puede ser menor a 1900")
    .max(new Date().getFullYear() + 1, "El año no puede ser mayor al año actual"),
  isActive: z.boolean().default(true),
});

export type VehiculoForm = z.infer<typeof vehiculoSchema>;
