export const CART_KEY = "shopping_cart";
export const CART_EVENT = "cart:updated";

export interface CartProduct {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
}

export interface CartItem extends CartProduct {
  cantidad: number;
}

function safeParseJSON<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function readCart(): Record<string, CartItem> {
  if (typeof window === "undefined") return {};
  return safeParseJSON<Record<string, CartItem>>(localStorage.getItem(CART_KEY), {});
}

export function writeCart(cart: Record<string, CartItem>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function upsertCartItem(producto: CartProduct, cantidad: number) {
  const cart = readCart();
  const key = String(producto.id);

  if (cantidad <= 0) {
    delete cart[key];
  } else {
    cart[key] = {
      ...producto,
      cantidad,
    };
  }

  writeCart(cart);
}

export function removeCartItem(productId: number) {
  const cart = readCart();
  const key = String(productId);
  if (cart[key]) {
    delete cart[key];
    writeCart(cart);
  }
}

export function getCartItemQuantity(productId: number): number | null {
  const cart = readCart();
  return cart[String(productId)]?.cantidad ?? null;
}

export function getCartSummary() {
  const cart = readCart();
  const totalItems = Object.values(cart).reduce((sum, item) => sum + (item.cantidad || 0), 0);
  const totalAmount = Object.values(cart).reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  return { totalItems, totalAmount };
}
