"use client";
import { ProductFilters } from "./filter.types";
import { MAX_PRICE } from "./constants";
import FilterSection from "./FilterSection";

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
  categories?: string[];
  parentCategories?: string[];
  brands?: string[];
}

export default function ProductFilterSidebar({
  filters,
  onFiltersChange,
  onClear,
  className,
  categories = [],
  parentCategories = [],
  brands = [],
}: Props) {
  const baseClass = "w-72 xl:w-80 shrink-0 border-r border-slate-200 min-h-screen sticky top-0";

  const handleToggle = <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K] extends (infer V)[] ? V : never,
  ) => {
    const current = filters[key] as unknown[];
    const updated = toggleItem(current, value) as ProductFilters[K];
    onFiltersChange({ ...filters, [key]: updated });
  };

  return (
    <aside className={`${className ?? baseClass} ${className ? "" : "hidden md:block"}`}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-blue-900">Filtros</h2>
            <p className="text-sm text-slate-500 mt-1">Refina los resultados por categoría, marca o precio.</p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold uppercase tracking-widest text-blue-900 hover:text-blue-700"
          >
            Limpiar
          </button>
        </div>

        <div className="space-y-2">
          <FilterSection title="Buscar">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 010 15z"
                />
              </svg>
              <input
                type="text"
                value={filters.search}
                onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
                placeholder="Buscar producto, marca o categoría"
                className="w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-200 transition-shadow"
              />
            </div>
          </FilterSection>

          <FilterSection title={`Categorías (${categories.length})`}>
            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent pr-1">
              <div className="space-y-1">
                {categories.map((category) => {
                  const active = filters.categories.includes(category);
                  const isParent = parentCategories.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleToggle("categories", category)}
                      className={`w-full text-left flex items-center gap-3 rounded-xl py-2 text-sm transition-colors ${
                        isParent ? "px-3 font-semibold" : "px-6"
                      } ${active ? "bg-slate-50 text-blue-900 font-medium" : "hover:bg-slate-50 text-slate-700"}`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          active ? "border-blue-900 bg-blue-900 text-white" : "border-slate-300 bg-white"
                        }`}
                      >
                        {active && (
                          <svg
                            className="h-3 w-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={4}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </FilterSection>

          <FilterSection title={`Marcas (${brands.length})`}>
            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent pr-1">
              <div className="space-y-1">
                {brands.map((brand) => {
                  const active = filters.brands.includes(brand);
                  return (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => handleToggle("brands", brand)}
                      className={`w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                        active ? "bg-slate-50 text-blue-900 font-medium" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          active ? "border-blue-900 bg-blue-900 text-white" : "border-slate-300 bg-white"
                        }`}
                      >
                        {active && (
                          <svg
                            className="h-3 w-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={4}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      {brand}
                    </button>
                  );
                })}
              </div>
            </div>
          </FilterSection>

          {/* <FilterSection title="Ofertas">
            <div className="space-y-3">
              {OFFERS.map((offer) => (
                <label key={offer} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.offers.includes(offer)}
                    onChange={() => handleToggle("offers", offer)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  {offer}
                </label>
              ))}
            </div>
          </FilterSection> */}

          {/* <FilterSection title="Valoración">
            <div className="flex gap-2 flex-wrap">
              {RATINGS.map((rating) => {
                const active = filters.ratings.includes(rating);
                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleToggle("ratings", rating)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                      active
                        ? "bg-amber-400 border-amber-400 text-slate-900"
                        : "bg-white border-slate-200 text-slate-700 hover:border-amber-400"
                    }`}
                  >
                    {"★".repeat(rating)}
                  </button>
                );
              })}
            </div>
          </FilterSection> */}

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
                className="w-full accent-blue-900"
              />
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>S/ 0</span>
                <span className="text-blue-900">S/ {filters.priceMax}</span>
              </div>
            </div>
          </FilterSection>
        </div>
      </div>
    </aside>
  );
}
