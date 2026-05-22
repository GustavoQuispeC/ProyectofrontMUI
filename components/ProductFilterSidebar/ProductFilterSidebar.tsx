"use client";

import { useEffect, useState } from "react";
import { DRAWER_OPEN_EVENT } from "@/components/cartdrawer/Cartdrawer";
import { ProductFilters } from "./filter.types";
import { BRANDS, CATEGORIES, OFFERS, RATINGS, MAX_PRICE } from "./constants";
import FilterSection from "./FilterSection";

const CART_KEY = "shopping_cart";
const CART_EVENT = "cart:updated";

type CartItem = {
  cantidad: number;
  precio: number;
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
}

export default function ProductFilterSidebar({ filters, onFiltersChange, onClear }: Props) {
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

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

  return (
    <aside className="hidden md:block w-72 xl:w-80 shrink-0 border-r border-slate-200 dark:border-neutral-800 min-h-screen sticky top-0">
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
              onChange={(event) =>
                onFiltersChange({ ...filters, search: event.target.value })
              }
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
              <p className="text-xs text-slate-500 dark:text-slate-400">Carrito conectado desde el mismo almacenamiento local.</p>
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
              <p className="text-sm text-slate-500 dark:text-slate-400">Agrega productos al carrito para ver el resumen.</p>
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
    </aside>
  );
}