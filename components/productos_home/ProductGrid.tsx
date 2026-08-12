import ProductCard from "./ProductCard";
import { Product } from "./product.types";

interface Props {
  products: Product[];
  onAdd?: (product: Product) => void;
  className?: string;
}

export default function ProductGrid({ products, onAdd, className }: Props) {
  const baseClasses = "grid grid-cols-2 md:grid-cols-4 gap-4";

  return (
    <div className={className ? `${baseClasses} ${className}` : baseClasses}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
