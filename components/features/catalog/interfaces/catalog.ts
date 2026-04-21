export interface CatalogProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  emoji: string;
  badge?: string;
  description?: string;
}

export interface CartItem extends CatalogProduct {
  qty: number;
}

export type CartState = Record<number, number>;
