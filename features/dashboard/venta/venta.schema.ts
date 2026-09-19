import { z } from "zod";

export const TIPO_PAGO_CONTADO = 1;
export const TIPO_PAGO_CREDITO = 2;
export const MEDIO_EFECTIVO = 1;
export const MEDIO_DEPOSITO_BANCARIO = 2;
export const MEDIO_CREDITO = 3;
export const MODALIDAD_RECOJO_TIENDA = 1;
export const MODALIDAD_ENVIO_DOMICILIO = 2;

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
    observaciones: optionalString,
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

const montoRecibidoSchema = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? null : Number(value)),
  z.number().min(0, "El monto recibido no puede ser negativo").nullable(),
);

const pagoSchema = z
  .object({
    tipoMedio: z.coerce.number().int().min(1, "Seleccione el medio de pago"),
    monto: z.coerce.number().positive("El monto debe ser mayor a 0"),
    montoRecibido: montoRecibidoSchema,
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
    if (pago.montoRecibido !== null && pago.montoRecibido < pago.monto) {
      ctx.addIssue({
        code: "custom",
        path: ["montoRecibido"],
        message: "El monto recibido no puede ser menor al monto aplicado",
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
    costoEnvio: z.coerce.number().min(0, "El costo de envío no puede ser negativo").default(0),
    observaciones: optionalString,
    modalidadEntrega: z.coerce.number().int().min(1, "Seleccione la modalidad de entrega"),
    direccionEntrega: optionalString,
    detalles: z.array(detalleSchema).min(1, "Agregue al menos un producto"),
    pagos: z.array(pagoSchema).min(1, "Agregue al menos un pago"),
  })
  .superRefine((data, ctx) => {
    if (data.modalidadEntrega === MODALIDAD_ENVIO_DOMICILIO && !data.direccionEntrega) {
      ctx.addIssue({
        code: "custom",
        path: ["direccionEntrega"],
        message: "La dirección de entrega es obligatoria para envíos a domicilio",
      });
    }

    if (data.tipoPago === TIPO_PAGO_CONTADO) {
      const subtotal = data.detalles.reduce((acc, d) => acc + d.cantidad * d.precioUnitario - d.descuentoUnitario, 0);
      const envio = data.modalidadEntrega === MODALIDAD_ENVIO_DOMICILIO ? data.costoEnvio : 0;
      const total = Math.max(0, subtotal - data.descuento + envio);
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
