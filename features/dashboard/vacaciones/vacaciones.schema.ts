import { z } from "zod";

export const RegistrarVacacionesSchema = z.object({
  empleadoId: z.number().min(1, "Seleccione un empleado."),
  fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria."),
  fechaFin: z.string().min(1, "La fecha de fin es obligatoria."),

  observacion: z
    .string()
    .transform((v) => v.trim().toUpperCase() || null)
    .refine((v) => v === null || v.length >= 5, {
      message: "La observación debe tener al menos 5 caracteres.",
    }),
});

export type RegistrarVacacionesForm = z.infer<typeof RegistrarVacacionesSchema>;
