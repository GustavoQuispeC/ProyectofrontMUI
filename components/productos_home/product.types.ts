export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  unit: string;
  image: string | null;
  rating: number;
  inStock: boolean;
  hasDiscount: boolean;
  freeShipping?: boolean;
}
