import { z } from "zod";

export const RegistrarPermisoSchema = z
  .object({
    empleadoId: z.number().min(1, "Seleccione un empleado."),
    fecha: z.string().min(1, "La fecha del permiso es obligatoria."),
    horaInicio: z.string().min(1, "La hora de inicio es obligatoria."),
    horaFin: z.string().min(1, "La hora final es obligatoria."),
    motivo: z.string().min(5, "El motivo debe tener al menos 5 caracteres."),
    lugar: z.string().min(3, "El lugar debe tener al menos 3 caracteres."),
  })
  .refine((data) => data.horaFin > data.horaInicio, {
    message: "La hora fin debe ser mayor a la hora inicio.",
    path: ["horaFin"],
  });

export type RegistrarPermisoForm = z.infer<typeof RegistrarPermisoSchema>;
