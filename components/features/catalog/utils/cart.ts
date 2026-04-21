import { CartItem, CartState, CatalogProduct } from "../interfaces/catalog";

export function addToCartState(cart: CartState, id: number): CartState {
  return {
    ...cart,
    [id]: (cart[id] ?? 0) + 1,
  };
}

export function changeCartItemQty(cart: CartState, id: number, delta: number): CartState {
  const next = { ...cart };
  const newQty = (next[id] ?? 0) + delta;

  if (newQty <= 0) {
    delete next[id];
    return next;
  }

  next[id] = newQty;
  return next;
}

export function removeCartItem(cart: CartState, id: number): CartState {
  const next = { ...cart };
  delete next[id];
  return next;
}

export function buildCartItems(cart: CartState, products: CatalogProduct[]): CartItem[] {
  return Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find((item) => item.id === Number(id));
      if (!product) {
        return null;
      }

      return {
        ...product,
        qty,
      };
    })
    .filter((item): item is CartItem => item !== null);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}
