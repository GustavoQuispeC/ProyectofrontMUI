export type ProductColor =
  | "Blue"
  | "Purple"
  | "Pink"
  | "Orange"
  | "Red"
  | "Yellow"
  | "Black"
  | "Gray";

export type ProductSize =
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL"
  | "XXXL"
  | "4XL";

export type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "name";

export interface Product {
  id: number;
  name: string;
  brand: string;
  size: ProductSize;
  color: ProductColor;
  price: number;
  image: string | null;
}