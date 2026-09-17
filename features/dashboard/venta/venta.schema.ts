import { z } from "zod";

export const TIPO_PAGO_CONTADO = 1;
export const TIPO_PAGO_CREDITO = 2;
export const MEDIO_DEPOSITO_BANCARIO = 2;
export const MODALIDAD_RECOJO_TIENDA = 1;
export const MODALIDAD_ENVIO_EMPRESA = 2;

const optionalString = z
  .string()
  .trim()
  .min(1, "Campo requerido")
  .or(z.literal(""))
  .or(z.null())
  .transform((value) => value || null);

const detalleSchema = z
  .object({
    productoId: z.coerce.number().int().min(1, "Seleccione un producto"),
    productoCodigo: z.string().optional(),
    productoNombre: z.string().optional(),
    unidadMedidaNombre: z.string().optional(),
    stockDisponible: z.coerce.number().optional(),
    cantidad: z.coerce.number().positive("La cantidad debe ser mayor a 0"),
    precioUnitario: z.coerce.number().positive("El precio unitario debe ser mayor a 0"),
    descuentoUnitario: z.coerce.number().min(0, "El descuento no puede ser negativo").default(0),
  })
  .superRefine((detalle, ctx) => {
    if (detalle.stockDisponible !== undefined && detalle.cantidad > detalle.stockDisponible) {
      ctx.addIssue({
        code: "custom",
        path: ["cantidad"],
        message: `Stock disponible: ${detalle.stockDisponible}`,
      });
    }
  });

const pagoSchema = z
  .object({
    tipoMedio: z.coerce.number().int().min(1, "Seleccione el medio de pago"),
    monto: z.coerce.number().positive("El monto debe ser mayor a 0"),
    banco: optionalString,
    numeroOperacion: optionalString,
    fechaDeposito: optionalString,
  })
  .superRefine((pago, ctx) => {
    if (pago.tipoMedio === MEDIO_DEPOSITO_BANCARIO && !pago.banco) {
      ctx.addIssue({
        code: "custom",
        path: ["banco"],
        message: "El banco es obligatorio para depósito bancario",
      });
    }
  });

export const ventaSchema = z
  .object({
    clienteId: z.coerce.number().int().min(1, "Seleccione un cliente"),
    clienteTipoDocumento: z.coerce.number().int().min(1, "Seleccione el tipo de documento"),
    tiendaId: z.coerce.number().int().min(1, "Seleccione una tienda"),
    tipoPago: z.coerce.number().int().min(1, "Seleccione el tipo de pago"),
    descuento: z.coerce.number().min(0, "El descuento no puede ser negativo").default(0),
    modalidadEntrega: z.coerce.number().int().min(1, "Seleccione la modalidad de entrega"),
    direccionEntrega: optionalString,
    detalles: z.array(detalleSchema).min(1, "Agregue al menos un producto"),
    pagos: z.array(pagoSchema).min(1, "Agregue al menos un pago"),
  })
  .superRefine((data, ctx) => {
    if (data.modalidadEntrega === MODALIDAD_ENVIO_EMPRESA && !data.direccionEntrega) {
      ctx.addIssue({
        code: "custom",
        path: ["direccionEntrega"],
        message: "La dirección de entrega es obligatoria para envío por empresa",
      });
    }

    if (data.tipoPago === TIPO_PAGO_CONTADO) {
      const subtotal = data.detalles.reduce((acc, d) => acc + d.cantidad * d.precioUnitario - d.descuentoUnitario, 0);
      const total = Math.max(0, subtotal - data.descuento);
      const pagado = data.pagos.reduce((acc, p) => acc + p.monto, 0);

      if (pagado < total) {
        ctx.addIssue({
          code: "custom",
          path: ["pagos"],
          message: `Pago al contado incompleto: faltan S/ ${(total - pagado).toFixed(2)} para cubrir el total`,
        });
      }
    }
  });

export type VentaForm = z.infer<typeof ventaSchema>;
