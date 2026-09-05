import { z } from "zod";

export const DetalleIngresoSchema = z.object({
  ProductoId: z.number().min(1, "Seleccione un producto."),
  Cantidad: z.number().min(1, "La cantidad debe ser al menos 1."),
});

export const RegistrarIngresoSchema = z.object({
  ProveedorId: z.number().min(1, "Seleccione un proveedor."),
  TiendaDestinoId: z.number().min(1, "Seleccione una tienda."),
  TipoDocumento: z.number().min(1, "Seleccione el tipo de documento."),
  SerieDocumento: z.string().min(1, "Ingrese la serie del documento."),
  NumeroDocumento: z.string().min(1, "Ingrese el número del documento."),
  Fecha: z.string().min(1, "La fecha es obligatoria."),
  Observaciones: z.string().optional().nullable(),
  MontoTotal: z.coerce.number({ message: "Ingrese el monto total." }).positive("El monto total debe ser mayor a 0"),
  Detalles: z.array(DetalleIngresoSchema).min(1, "Agregue al menos un detalle."),
});

export type RegistrarIngresoForm = z.infer<typeof RegistrarIngresoSchema>;
