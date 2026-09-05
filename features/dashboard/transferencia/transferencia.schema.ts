import { z } from "zod";

export const DetalleTransferenciaSchema = z.object({
  ProductoId: z.number().min(1, "Seleccione un producto."),
  Cantidad: z.number().min(1, "La cantidad debe ser al menos 1."),
});

export const RegistrarTransferenciaSchema = z
  .object({
    TiendaOrigenId: z.number().min(1, "Seleccione la tienda origen."),
    TiendaDestinoId: z.number().min(1, "Seleccione la tienda destino."),
    Fecha: z.string().min(1, "La fecha es obligatoria."),
    Motivo: z.string().optional().nullable(),
    Detalles: z.array(DetalleTransferenciaSchema).min(1, "Agregue al menos un detalle."),
  })
  .refine((data) => data.TiendaOrigenId !== data.TiendaDestinoId, {
    message: "La tienda origen y destino no pueden ser la misma.",
    path: ["TiendaDestinoId"],
  });

export type RegistrarTransferenciaForm = z.infer<typeof RegistrarTransferenciaSchema>;
