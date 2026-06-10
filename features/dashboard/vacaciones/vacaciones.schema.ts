import { z } from "zod";

export const RegistrarVacacionesSchema = z
  .object({
    empleadoId: z.number().min(1, "Seleccione un empleado."),
    fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria."),
    fechaFin: z.string().min(1, "La fecha de fin es obligatoria."),

    observacion: z.string().min(5, "La observación debe tener al menos 5 caracteres."),
  })
  .refine((data) => data.fechaFin > data.fechaInicio, {
    message: "La fecha de fin debe ser mayor a la fecha de inicio.",
    path: ["fechaFin"],
  });

export type RegistrarVacacionesForm = z.infer<typeof RegistrarVacacionesSchema>;
