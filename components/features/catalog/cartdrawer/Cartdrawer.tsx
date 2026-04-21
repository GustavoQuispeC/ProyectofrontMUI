"use client";
import { Add, DeleteOutlined, Remove, ShoppingCart, X } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";

const CART_KEY = "shopping_cart";
const CART_EVENT = "cart:updated";
export const DRAWER_OPEN_EVENT = "drawer:open";

type CartItem = {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
};

type CartMap = Record<string, CartItem>;

function safeParseJSON<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readCart(): CartMap {
  if (typeof window === "undefined") return {};
  return safeParseJSON<CartMap>(localStorage.getItem(CART_KEY), {});
}

function writeCart(cart: CartMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_EVENT));
}

function cartToArray(cart: CartMap): CartItem[] {
  return Object.values(cart);
}

function getTotalQty(cart: CartMap): number {
  return Object.values(cart).reduce((acc, it) => acc + (it.cantidad || 0), 0);
}

function setQty(productId: number, qty: number) {
  const cart = readCart();
  const key = String(productId);
  if (qty <= 0) {
    delete cart[key];
    writeCart(cart);
    return;
  }
  if (!cart[key]) return;
  cart[key] = { ...cart[key], cantidad: qty };
  writeCart(cart);
}

function clearCart() {
  writeCart({});
}

/* ─── CartButton ─────────────────────────────────────────── */
export function CartButton() {
  const [badgeQty, setBadgeQty] = useState(0);

  useEffect(() => {
    const refresh = () => setBadgeQty(getTotalQty(readCart()));
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(CART_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CART_EVENT, refresh);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Carrito"
      onClick={() => window.dispatchEvent(new Event(DRAWER_OPEN_EVENT))}
      className="relative flex h-12 w-12 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
    >
      <ShoppingCart className="h-6 w-6 text-orange-500" />
      {badgeQty > 0 && (
        <span className="absolute top-0.5 right-0.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-extrabold text-white">
          {badgeQty > 99 ? "99+" : badgeQty}
        </span>
      )}
    </button>
  );
}

/* ─── DrawerComponent ────────────────────────────────────── */
export default function DrawerComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>(() => {
    const cart = readCart();
    return cartToArray(cart);
  });
  const [badgeQty, setBadgeQty] = useState(() => {
    const cart = readCart();
    return getTotalQty(cart);
  });

  const onClose = () => setIsOpen(false);

  useEffect(() => {
    const refresh = () => {
      const cart = readCart();
      setItems(cartToArray(cart));
      setBadgeQty(getTotalQty(cart));
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) refresh();
    };

    const onOpen = () => setIsOpen(true);

    window.addEventListener("storage", onStorage);
    window.addEventListener(CART_EVENT, refresh);
    window.addEventListener(DRAWER_OPEN_EVENT, onOpen);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CART_EVENT, refresh);
      window.removeEventListener(DRAWER_OPEN_EVENT, onOpen);
    };
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const subtotal = useMemo(() => items.reduce((acc, it) => acc + it.precio * it.cantidad, 0), [items]);

  const inc = (id: number) => {
    const it = items.find((x) => x.id === id);
    if (it) setQty(id, it.cantidad + 1);
  };

  const dec = (id: number) => {
    const it = items.find((x) => x.id === id);
    if (it) setQty(id, it.cantidad - 1);
  };

  const onManualQty = (id: number, raw: string) => {
    if (raw.trim() === "") {
      setQty(id, 0);
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    setQty(id, Math.max(0, Math.floor(n)));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={[
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col",
          "bg-white dark:bg-slate-900",
          "shadow-2xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 px-5 py-4">
          <div>
            <p className="font-extrabold text-blue-900 dark:text-white">Tu carrito</p>
            <p className="text-xs text-slate-500 dark:text-white/60">
              {badgeQty} {badgeQty === 1 ? "producto" : "productos"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-slate-600 dark:text-white/70" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-6 text-center">
              <p className="font-semibold text-slate-800 dark:text-white/80">Tu carrito está vacío</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 transition-colors"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 p-4"
                >
                  <div className="flex gap-4">
                    {/* Imagen */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/5 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                      <img
                        src={it.imagen}
                        alt={it.nombre}
                        className="h-full w-full object-contain p-2"
                        loading="lazy"
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900 dark:text-white">{it.nombre}</p>
                      <p className="text-sm text-slate-500 dark:text-white/60">S/ {it.precio.toFixed(2)}</p>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {/* Cantidad */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-slate-50 dark:bg-white/5 px-2 py-1">
                          <button
                            type="button"
                            onClick={() => dec(it.id)}
                            aria-label="Disminuir"
                            className="grid h-8 w-8 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                          >
                            <Remove className="h-4 w-4" />
                          </button>

                          <input
                            type="number"
                            min={0}
                            value={it.cantidad}
                            onChange={(e) => onManualQty(it.id, e.target.value)}
                            className="w-14 bg-transparent text-center font-bold text-slate-900 outline-none dark:text-white"
                          />

                          <button
                            type="button"
                            onClick={() => inc(it.id)}
                            aria-label="Aumentar"
                            className="grid h-8 w-8 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                          >
                            <Add className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Eliminar */}
                        <button
                          type="button"
                          onClick={() => setQty(it.id, 0)}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                        >
                          <DeleteOutlined className="h-4 w-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>

                    {/* Total ítem */}
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-white/60">Total</p>
                      <p className="font-extrabold text-slate-900 dark:text-white">
                        S/ {(it.precio * it.cantidad).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-black/5 dark:border-white/10 px-5 py-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-white/70">Subtotal</span>
            <span className="font-extrabold text-slate-900 dark:text-white">S/ {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={items.length === 0}
              className="w-full rounded-xl bg-orange-600 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Ir a pagar
            </button>

            <button
              type="button"
              disabled={items.length === 0}
              onClick={() => clearCart()}
              className="w-full rounded-xl border border-black/10 dark:border-white/15 py-2.5 text-sm font-semibold text-slate-700 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Vaciar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
