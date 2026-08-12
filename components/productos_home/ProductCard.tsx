"use client";

import Image from "next/image";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Product } from "./product.types";
import ProductPlaceholder from "./ProductPlaceholder";

interface Props {
  product: Product;
  onAdd?: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: Props) {
  return (
    <article className="group rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-lg transition-all h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-white">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-3"
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized
          />
        ) : (
          <ProductPlaceholder name={product.name} />
        )}

        {product.hasDiscount && (
          <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-bold rounded-md bg-red-500 text-white">
            OFERTA
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 border-t border-slate-100">
        <p className="text-xs text-slate-400 uppercase tracking-widest">{product.brand}</p>

        <h3 className="mt-1 text-sm font-semibold text-slate-900 line-clamp-2 min-h-16">{product.name}</h3>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-lg font-bold">S/ {product.price.toFixed(2)}</span>
            {product.inStock ? (
              <span className="text-xs text-green-600">Stock</span>
            ) : (
              <span className="text-xs text-red-500">Agotado</span>
            )}
          </div>

          <button
            onClick={() => onAdd?.(product)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            <ShoppingCartIcon sx={{ fontSize: 16 }} />
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
