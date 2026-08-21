import { ListarProducto } from "@/features/dashboard/producto/Producto.types";
import { Product } from "./product.types";

export function mapProductoToStore(producto: ListarProducto): Product {
  const principal = producto.imagenes.find((img) => img.esPrincipal) ?? producto.imagenes[0];
  const precio = producto.precios[0]?.precio ?? producto.costoActual ?? 0;

  return {
    id: producto.id,
    name: producto.nombre,
    brand: producto.marcaNombre,
    category: producto.categoriaNombre,
    price: precio,
    unit: producto.unidadMedidaNombre,
    image: principal?.url ?? null,
    rating: 0,
    inStock: true,
    hasDiscount: false,
    freeShipping: false,
  };
}
