export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string | null;

  rating: number;
  inStock: boolean;
  hasDiscount: boolean;
}