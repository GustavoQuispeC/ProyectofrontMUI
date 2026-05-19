import { Product } from "./types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <article className="rounded-xl overflow-hidden border border-slate-200 bg-white dark:bg-neutral-900">
      <div className="aspect-[4/5] bg-slate-100" />

      <div className="p-4">
        <p className="text-xs text-slate-400 mb-1">
          {product.brand}
        </p>

        <h3 className="text-sm font-medium mb-3">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="font-semibold">
            ${product.price}
          </span>

          <span>{product.size}</span>
        </div>
      </div>
    </article>
  );
}