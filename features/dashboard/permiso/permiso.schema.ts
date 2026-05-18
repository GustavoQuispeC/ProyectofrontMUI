import { z } from "zod";

export const PermisoSchema = z.object({
  empleadoId: z.string().min(1, "Seleccione un empleado"),
  nombreCompleto: z.string().min(1, "Seleccione un empleado"),
  fechaPermiso: z.string().min(1, "La fecha del permiso es obligatoria"),
});

export type PermisoForm = z.infer<typeof PermisoSchema>;
