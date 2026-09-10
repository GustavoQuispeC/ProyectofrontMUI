import { z } from "zod";

const detalleSchema = z.object({
  productoId: z.number().min(1, "Seleccione un producto"),
  cantidad: z.number({ message: "Ingrese una cantidad válida" }).min(0.01, "La cantidad debe ser mayor a 0"),
});

export const salidaSchema = z
  .object({
    tiendaOrigenId: z.number().min(1, "Seleccione una tienda"),
    origen: z.number().min(1, "Seleccione un origen"),
    empleadoSolicitaId: z.number().nullable().optional(),
    ventaId: z.number().nullable().optional(),
    motivo: z.string().trim().max(500, "Máximo 500 caracteres").optional().nullable(),
    fecha: z.string().min(1, "La fecha es requerida"),
    detalles: z.array(detalleSchema).min(1, "Debe agregar al menos un producto"),
  })
  .refine((data) => data.origen !== 2 || (data.empleadoSolicitaId && data.empleadoSolicitaId > 0), {
    message: "El empleado solicitante es requerido para uso interno",
    path: ["empleadoSolicitaId"],
  });

export type SalidaForm = z.infer<typeof salidaSchema>;
