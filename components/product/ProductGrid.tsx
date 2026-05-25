import ProductCard from "./ProductCard";
import { Product } from "./product.types";

interface Props {
  products: Product[];
  onAdd?: (product: Product) => void;
}

export default function ProductGrid({ products, onAdd }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}