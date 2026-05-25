"use client";

import { useEffect, useState } from "react";
import { DRAWER_OPEN_EVENT } from "@/components/cartdrawer/Cartdrawer";
import { ProductFilters } from "./filter.types";
import { BRANDS, CATEGORIES, OFFERS, RATINGS, MAX_PRICE } from "./constants";
import FilterSection from "./FilterSection";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

const CART_KEY = "shopping_cart";
const CART_EVENT = "cart:updated";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  badge?: string;
}

function writeCart(cart: Record<string, CartItem>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_EVENT));
}

function upsertCartItem(producto: Producto, cantidad: number) {
  const cart = readCart();
  const key = String(producto.id);
  cart[key] = {
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    imagen: producto.imagen,
    cantidad,
  };
  writeCart(cart);
}

function removeCartItem(productId: number) {
  const cart = readCart();
  const key = String(productId);
  if (cart[key]) {
    delete cart[key];
    writeCart(cart);
  }
}

type CartItem = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
};

function safeParseJSON<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readCart(): Record<string, CartItem> {
  if (typeof window === "undefined") return {};
  return safeParseJSON<Record<string, CartItem>>(localStorage.getItem(CART_KEY), {});
}

function getCartSummary() {
  const cart = readCart();
  const totalItems = Object.values(cart).reduce((sum, item) => sum + (item.cantidad || 0), 0);
  const totalAmount = Object.values(cart).reduce((sum, item) => sum + (item.precio || 0) * item.cantidad, 0);
  return { totalItems, totalAmount };
}

function getCartItemQuantity(productId: number): number | null {
  const cart = readCart();
  return cart[String(productId)]?.cantidad ?? null;
}

function toggleItem<T>(items: T[], value: T) {
  if (items.includes(value)) {
    return items.filter((item) => item !== value);
  }
  return [...items, value];
}

interface Props {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClear: () => void;
  className?: string;
}

export default function ProductFilterSidebar({ filters, onFiltersChange, onClear, className }: Props) {
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  useEffect(() => {
    const refresh = () => {
      const { totalItems, totalAmount } = getCartSummary();
      setCartCount(totalItems);
      setCartTotal(totalAmount);
    };

    refresh();
    window.addEventListener(CART_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(CART_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const baseClass = "w-72 xl:w-80 shrink-0 border-r border-slate-200 dark:border-neutral-800 min-h-screen sticky top-0";

  return (
    <aside className={`${className ?? baseClass} ${className ? "" : "hidden md:block"}`}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold">Filtros</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Usa el buscador o elige categorías para refinar los resultados.
            </p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold uppercase tracking-widest text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
          >
            Limpiar
          </button>
        </div>

        <div className="space-y-4">
          <FilterSection title="Buscar">
            <input
              type="text"
              value={filters.search}
              onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
              placeholder="Buscar producto, marca o categoría"
              className="w-full rounded-2xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
            />
          </FilterSection>

          <FilterSection title="Categorías">
            <div className="space-y-3">
              {CATEGORIES.map((category) => (
                <label key={category} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() =>
                      onFiltersChange({
                        ...filters,
                        categories: toggleItem(filters.categories, category),
                      })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  {category}
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Marcas">
            <div className="space-y-3">
              {BRANDS.map((brand) => (
                <label key={brand} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() =>
                      onFiltersChange({
                        ...filters,
                        brands: toggleItem(filters.brands, brand),
                      })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  {brand}
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Ofertas">
            <div className="space-y-3">
              {OFFERS.map((offer) => (
                <label key={offer} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.offers.includes(offer)}
                    onChange={() =>
                      onFiltersChange({
                        ...filters,
                        offers: toggleItem(filters.offers, offer),
                      })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  {offer}
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Valoración">
            <div className="space-y-3">
              {RATINGS.map((rating) => (
                <label key={rating} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.ratings.includes(rating)}
                    onChange={() =>
                      onFiltersChange({
                        ...filters,
                        ratings: toggleItem(filters.ratings, rating),
                      })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  {"★".repeat(rating)}
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Precio hasta">
            <div className="space-y-4">
              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                value={filters.priceMax}
                onChange={(event) =>
                  onFiltersChange({
                    ...filters,
                    priceMax: Number(event.target.value),
                  })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>S/ 0</span>
                <span>S/ {filters.priceMax}</span>
              </div>
            </div>
          </FilterSection>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Resumen del carrito</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Carrito conectado desde el mismo almacenamiento local.
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-orange-500">{cartCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">items</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-3">
            {cartCount ? (
              <p className="text-sm text-slate-700 dark:text-slate-300">Total estimado S/ {cartTotal.toFixed(2)}</p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Agrega productos al carrito para ver el resumen.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(DRAWER_OPEN_EVENT))}
            className="mt-4 w-full rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Ver carrito
          </button>
        </div>
      </div>

      {/* MODAL (Tailwind Refactor) */}
      {isOpen && productoSeleccionado && (
        <AddToCartModal isOpen={isOpen} onClose={() => setIsOpen(false)} producto={productoSeleccionado} />
      )}
    </aside>
  );
}

/* ================= MODAL CART ================= */

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: Producto;
}

function AddToCartModal({ isOpen, onClose, producto }: AddToCartModalProps) {
  const [cantidad, setCantidad] = useState(() => {
    const storedQty = getCartItemQuantity(producto.id);
    return storedQty ?? 1;
  });

  const syncStorage = (qty: number) => {
    if (qty <= 0) {
      removeCartItem(producto.id);
    } else {
      upsertCartItem(producto, qty);
    }
  };

  const incrementar = () => {
    const next = cantidad + 1;
    setCantidad(next);
    syncStorage(next);
  };

  const disminuir = () => {
    const next = Math.max(0, cantidad - 1);
    setCantidad(next);
    syncStorage(next);
  };

  const handleChange = (value: string) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return;
    const next = Math.max(0, Math.floor(n));
    setCantidad(next);
    syncStorage(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 pb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
            <CheckCircleIcon />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">¡Producto agregado!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Se añadió al carrito correctamente</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <RemoveIcon className="rotate-45" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-start gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="shrink-0 w-24 h-24 bg-white dark:bg-gray-700 rounded-lg p-2 flex items-center justify-center">
              <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-blue-900 dark:text-white mb-1 line-clamp-2">{producto.nombre}</h4>
              <p className="text-2xl font-extrabold text-orange-500 mb-3">S/ {producto.precio.toFixed(2)}</p>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Cantidad:</span>
                <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-700">
                  <button
                    onClick={disminuir}
                    className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <RemoveIcon sx={{ fontSize: 16 }} className="text-gray-700 dark:text-gray-300" />
                  </button>
                  <input
                    type="number"
                    value={cantidad}
                    onChange={(e) => handleChange(e.target.value)}
                    className="w-12 text-center outline-none bg-transparent font-semibold text-gray-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={incrementar}
                    className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <AddIcon sx={{ fontSize: 16 }} className="text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-xl font-bold text-blue-900 dark:text-white">
                  S/ {(producto.precio * cantidad).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            Seguir comprando
          </button>
          <button
            onClick={() => {
              onClose();
              window.dispatchEvent(new Event(DRAWER_OPEN_EVENT));
            }}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all"
          >
            Ir al carrito
            <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
