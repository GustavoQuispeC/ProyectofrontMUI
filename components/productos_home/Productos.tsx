"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useProductosPublicos } from "@/features/store/productos/useProductosPublicos";
import AddToCartModal from "@/components/cartdrawer/AddToCartModal";
import { upsertCartItem } from "@/components/cartdrawer/cartService";
import { ProductGrid } from "@/components/productos_home";
import { Product } from "@/components/productos_home/product.types";
import { mapProductoToStore } from "@/components/productos_home/product.mapper";

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Productos() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { productos, loading } = useProductosPublicos({
    pagina: 1,
    tamanoPagina: 100,
  });

  const featuredProducts = useMemo(() => {
    if (!productos.length) return [];
    return shuffle(productos.map(mapProductoToStore)).slice(0, 16);
  }, [productos]);

  const handleAdd = (product: Product) => {
    upsertCartItem(
      {
        id: product.id,
        nombre: product.name,
        precio: product.price,
        imagen: product.image ?? "",
      },
      1,
    );
    setSelectedProduct(product);
    setIsOpen(true);
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <ShoppingCartOutlinedIcon sx={{ fontSize: 18 }} />
            Productos destacados
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-4">Catálogo de Productos</h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Encuentra los mejores materiales de construcción con precios competitivos
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando productos...</div>
        ) : featuredProducts.length > 0 ? (
          <>
            <ProductGrid products={featuredProducts} onAdd={handleAdd} className="gap-3 sm:gap-4 lg:gap-6" />

            <div className="mt-8 flex justify-center">
              <Link
                href="/productFilter"
                className="group inline-flex items-center gap-2 rounded-xl border border-orange-600 bg-white px-5 py-2.5 text-sm font-bold text-orange-600 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-orange-600 hover:text-white hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <StorefrontOutlinedIcon sx={{ fontSize: 18 }} />
                Explorar catálogo completo
                <ArrowForwardIcon
                  sx={{ fontSize: 16 }}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">No hay productos disponibles por el momento.</div>
        )}
      </div>

      {isOpen && selectedProduct && (
        <AddToCartModal
          key={selectedProduct.id}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          producto={{
            id: selectedProduct.id,
            nombre: selectedProduct.name,
            precio: selectedProduct.price,
            imagen: selectedProduct.image ?? "",
          }}
        />
      )}
    </section>
  );
}
