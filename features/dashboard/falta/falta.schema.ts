import { z } from "zod";
import { Justificacion } from "./falta.constants";

export const RegistrarFaltasSchema = z
  .object({
    empleadoId: z.number().min(1, "Seleccione un empleado."),
    fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria."),
    fechaFin: z.string().min(1, "La fecha de fin es obligatoria."),
    justificacion: z.nativeEnum(Justificacion, { message: "Seleccione si la falta está justificada." }),
    observacion: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.justificacion === Justificacion.Si && data.observacion.trim().length < 5) {
      ctx.addIssue({
        code: "custom",
        path: ["observacion"],
        message: "La observación debe tener al menos 5 caracteres.",
      });
    }
  });

export type RegistrarFaltasForm = z.infer<typeof RegistrarFaltasSchema>;

export const FaltaMensualSchema = z.object({
  anio: z.number().min(2000).max(2100),
  mes: z.number().min(1).max(12),
});

export type FaltaMensualForm = z.infer<typeof FaltaMensualSchema>;
