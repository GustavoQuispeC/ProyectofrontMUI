"use client";

import { Product } from "./product.types";
import ProductPlaceholder from "./ProductPlaceholder";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <article className="rounded-2xl overflow-hidden border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:shadow-lg transition-all">

      <div className="relative aspect-square overflow-hidden">
        <ProductPlaceholder name={product.name} />

        {product.hasDiscount && (
          <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-bold rounded-md bg-red-500 text-white">
            OFERTA
          </span>
        )}
      </div>

      <div className="p-4">

        <p className="text-xs text-slate-400 uppercase tracking-widest">
          {product.brand}
        </p>

        <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50 line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>
              {i < product.rating ? "★" : "☆"}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">

          <span className="text-lg font-bold">
            S/ {product.price}
          </span>

          {product.inStock ? (
            <span className="text-xs text-green-600">
              Stock
            </span>
          ) : (
            <span className="text-xs text-red-500">
              Agotado
            </span>
          )}
        </div>

        <button className="mt-4 w-full py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:opacity-90 transition">
          Agregar
        </button>
      </div>
    </article>
  );
}