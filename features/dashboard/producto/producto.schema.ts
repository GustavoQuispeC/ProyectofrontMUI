import { z } from "zod";

const MAX_IMAGENES = 5;

export const imagenProductoSchema = z.object({
  id: z.number().optional(),
  url: z.string().trim().nullable().default(null),
  esPrincipal: z.boolean(),
  orden: z.coerce.number().int().min(1, "El orden debe ser mayor o igual a 1"),
  eliminar: z.boolean().optional(),
});

export const precioProductoSchema = z
  .object({
    id: z.number().optional(),
    listaPrecioId: z.coerce.number().min(1, "Seleccione una lista de precio"),
    precio: z.coerce.number().positive("El precio debe ser mayor a 0.00"),
    precioMinimo: z.coerce.number().nullable().default(null),
    precioMaximo: z.coerce.number().nullable().default(null),
    fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria"),
    fechaFin: z.string().nullable().default(null),
    eliminar: z.boolean().optional(),
  })
  .refine((data) => data.precioMinimo === null || data.precioMinimo === 0 || data.precioMinimo <= data.precio, {
    message: "El precio mínimo no puede ser mayor al precio",
    path: ["precioMinimo"],
  })
  .refine((data) => data.precioMaximo === null || data.precioMaximo === 0 || data.precioMaximo >= data.precio, {
    message: "El precio máximo no puede ser menor al precio",
    path: ["precioMaximo"],
  });

export const productoSchema = z
  .object({
    codigoBarras: z.string().trim().default(""),
    categoriaId: z.coerce.number().min(1, "Seleccione una subcategoría"),
    marcaId: z.coerce.number().min(1, "Seleccione una marca"),
    unidadMedidaId: z.coerce.number().min(1, "Seleccione una unidad de medida"),
    nombre: z.string().trim().min(1, "El nombre del producto es obligatorio"),
    descripcion: z.string().trim().default(""),
    costoActual: z.coerce.number().min(0, "El costo actual no puede ser negativo"),
    stockMinimo: z.coerce.number().int().min(0, "El stock mínimo no puede ser negativo"),
    fechaVencimiento: z.string().nullable().default(null),
    imagenes: z
      .array(imagenProductoSchema)
      .max(MAX_IMAGENES, `Solo se permiten un máximo de ${MAX_IMAGENES} imágenes por producto`)
      .default([]),
    precios: z.array(precioProductoSchema).min(1, "Debe registrar al menos un precio"),
  })
  .superRefine((data, ctx) => {
    const principales = data.imagenes.filter((img) => img.esPrincipal);

    if (data.imagenes.length > 0 && principales.length !== 1) {
      ctx.addIssue({
        code: "custom",
        path: ["imagenes"],
        message: "Debe marcar exactamente una imagen como principal",
      });
    }
  })
  .superRefine((data, ctx) => {
    data.precios.forEach((precio, index) => {
      if (precio.precio <= data.costoActual) {
        ctx.addIssue({
          code: "custom",
          path: ["precios", index, "precio"],
          message: "El precio debe ser mayor al costo actual",
        });
      }

      if (precio.precioMinimo !== null && precio.precioMinimo !== undefined && precio.precioMinimo < data.costoActual) {
        ctx.addIssue({
          code: "custom",
          path: ["precios", index, "precioMinimo"],
          message: "El precio mínimo debe ser mayor o igual al costo actual",
        });
      }

      if (precio.precioMinimo !== null && precio.precioMinimo !== undefined && precio.precioMinimo > precio.precio) {
        ctx.addIssue({
          code: "custom",
          path: ["precios", index, "precioMinimo"],
          message: "El precio mínimo no puede ser mayor al precio",
        });
      }

      if (precio.precioMaximo !== null && precio.precioMaximo !== undefined && precio.precioMaximo < precio.precio) {
        ctx.addIssue({
          code: "custom",
          path: ["precios", index, "precioMaximo"],
          message: "El precio máximo debe ser mayor o igual al precio",
        });
      }

      if (precio.fechaFin && precio.fechaInicio && precio.fechaFin <= precio.fechaInicio) {
        ctx.addIssue({
          code: "custom",
          path: ["precios", index, "fechaFin"],
          message: "La fecha de fin debe ser posterior a la fecha de inicio",
        });
      }
    });
  });

export type ProductoForm = z.infer<typeof productoSchema>;
export type ImagenProductoForm = z.infer<typeof imagenProductoSchema>;
export type PrecioProductoForm = z.infer<typeof precioProductoSchema>;
