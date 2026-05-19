// "use client";

// import React from "react";

// import FilterSection from "./FilterSection";

// import {
//   ProductColor,
//   ProductSize,
// } from "./types";

// interface ProductFilterPanelProps {
//   activeCount: number;

//   searchTerm: string;
//   setSearchTerm: React.Dispatch<
//     React.SetStateAction<string>
//   >;

//   selectedBrands: string[];
//   setSelectedBrands: React.Dispatch<
//     React.SetStateAction<string[]>
//   >;

//   selectedSizes: ProductSize[];
//   setSelectedSizes: React.Dispatch<
//     React.SetStateAction<ProductSize[]>
//   >;

//   selectedColors: ProductColor[];
//   setSelectedColors: React.Dispatch<
//     React.SetStateAction<ProductColor[]>
//   >;

//   handleClearAll: () => void;

//   onClose?: () => void;
// }

// export default function ProductFilterPanel({
//   activeCount,
//   searchTerm,
//   setSearchTerm,
//   selectedBrands,
//   setSelectedBrands,
//   selectedSizes,
//   setSelectedSizes,
//   selectedColors,
//   setSelectedColors,
//   handleClearAll,
//   onClose,
// }: ProductFilterPanelProps) {
//   const brands = ["Nike", "Zara", "H&M"];
//   const sizes = ["S", "M", "L"];
//   const colors = ["Red", "Blue", "Black"];

//   return (
//     <nav className="flex flex-col h-full">
//       <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-200">
//         <h2 className="text-sm font-semibold uppercase">
//           Filters ({activeCount})
//         </h2>

//         <div className="flex items-center gap-2">
//           <button onClick={handleClearAll}>
//             Clear
//           </button>

//           {onClose && (
//             <button onClick={onClose}>
//               ✕
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto px-5 py-1">
//         <FilterSection title="Brand">
//           <input
//             type="search"
//             placeholder="Search brands"
//             value={searchTerm}
//             onChange={(e) =>
//               setSearchTerm(e.target.value)
//             }
//             className="w-full border rounded-lg px-3 py-2"
//           />

//           <div className="space-y-2 mt-4">
//             {brands.map((brand) => (
//               <label
//                 key={brand}
//                 className="flex items-center gap-2"
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedBrands.includes(
//                     brand
//                   )}
//                   onChange={() =>
//                     setSelectedBrands((prev) =>
//                       prev.includes(brand)
//                         ? prev.filter(
//                             (b) => b !== brand
//                           )
//                         : [...prev, brand]
//                     )
//                   }
//                 />

//                 {brand}
//               </label>
//             ))}
//           </div>
//         </FilterSection>

//         <FilterSection title="Size">
//           <div className="flex gap-2">
//             {sizes.map((size) => (
//               <button
//                 key={size}
//                 onClick={() =>
//                   setSelectedSizes((prev) =>
//                     prev.includes(
//                       size as ProductSize
//                     )
//                       ? prev.filter(
//                           (s) => s !== size
//                         )
//                       : [
//                           ...prev,
//                           size as ProductSize,
//                         ]
//                   )
//                 }
//                 className="px-3 py-1 border rounded"
//               >
//                 {size}
//               </button>
//             ))}
//           </div>
//         </FilterSection>

//         <FilterSection title="Color">
//           <div className="flex gap-2">
//             {colors.map((color) => (
//               <button
//                 key={color}
//                 onClick={() =>
//                   setSelectedColors((prev) =>
//                     prev.includes(
//                       color as ProductColor
//                     )
//                       ? prev.filter(
//                           (c) => c !== color
//                         )
//                       : [
//                           ...prev,
//                           color as ProductColor,
//                         ]
//                   )
//                 }
//                 className="px-3 py-1 border rounded"
//               >
//                 {color}
//               </button>
//             ))}
//           </div>
//         </FilterSection>
//       </div>
//     </nav>
//   );
// }

"use client";

import { useState, useMemo, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductColor =
  | "Blue" | "Purple" | "Pink" | "Orange"
  | "Red"  | "Yellow" | "Black" | "Gray";

export type ProductSize =
  | "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | "4XL";

export type SortOption = "default" | "price-asc" | "price-desc" | "name";

export interface Product {
  id:    number;
  name:  string;
  brand: string;
  size:  ProductSize;
  color: ProductColor;
  price: number;
  image: string | null;
}

interface ColorOption {
  name: ProductColor;
  bg:   string;
  ring: string;
}

interface ProductPlaceholderProps {
  colorName: ProductColor;
  index:     number;
}

interface ProductCardProps {
  product: Product;
  index:   number;
}

interface FilterSectionProps {
  title:        string;
  children:     ReactNode;
  defaultOpen?: boolean;
}

interface ChipProps {
  label:    string;
  onRemove: () => void;
}

interface EmptyStateProps {
  onClear: () => void;
}

interface FilterPanelProps {
  activeCount:    number;
  searchTerm:     string;
  selectedBrands: string[];
  selectedSizes:  ProductSize[];
  selectedColors: ProductColor[];
  priceRange:     [number, number];
  onSearchChange: (value: string) => void;
  onToggleBrand:  (brand: string) => void;
  onToggleSize:   (size: ProductSize) => void;
  onToggleColor:  (color: ProductColor) => void;
  onPriceChange:  (range: [number, number]) => void;
  onClearAll:     () => void;
  onCloseDrawer:  () => void;
}

export interface ProductFilterProps {
  products?: Product[];
}

// ─── Sample products ──────────────────────────────────────────────────────────

const SAMPLE_PRODUCTS: Product[] = [
  { id: 1,  name: "Relaxed Oxford Shirt",   brand: "Uniqlo",         size: "M",   color: "Blue",   price: 49,  image: null },
  { id: 2,  name: "High-Waist Flare Jeans", brand: "Levi's",         size: "S",   color: "Black",  price: 120, image: null },
  { id: 3,  name: "Oversized Logo Tee",     brand: "Nike",           size: "L",   color: "Gray",   price: 65,  image: null },
  { id: 4,  name: "Linen Midi Dress",       brand: "Zara",           size: "XS",  color: "Pink",   price: 89,  image: null },
  { id: 5,  name: "Ribbed Knit Sweater",    brand: "H&M",            size: "M",   color: "Orange", price: 39,  image: null },
  { id: 6,  name: "Track Jacket",           brand: "Adidas",         size: "L",   color: "Purple", price: 95,  image: null },
  { id: 7,  name: "Essential Cargo Pants",  brand: "Uniqlo",         size: "XL",  color: "Gray",   price: 72,  image: null },
  { id: 8,  name: "Classic Polo Shirt",     brand: "Tommy Hilfiger", size: "M",   color: "Red",    price: 110, image: null },
  { id: 9,  name: "Leather Bomber Jacket",  brand: "Zara",           size: "S",   color: "Black",  price: 299, image: null },
  { id: 10, name: "Ultra Boost Hoodie",     brand: "Puma",           size: "XXL", color: "Yellow", price: 85,  image: null },
  { id: 11, name: "Slim Chino Trousers",    brand: "H&M",            size: "L",   color: "Orange", price: 55,  image: null },
  { id: 12, name: "Windbreaker Shell",      brand: "Nike",           size: "M",   color: "Blue",   price: 180, image: null },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const BRANDS: string[] = [
  "Zara", "H&M", "Uniqlo", "Levi's", "Nike", "Adidas", "Puma", "Tommy Hilfiger",
];

const SIZES: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "4XL"];

const MAX_PRICE = 1000;

const COLOR_OPTIONS: ColorOption[] = [
  { name: "Blue",   bg: "bg-blue-600",                        ring: "ring-blue-600"   },
  { name: "Purple", bg: "bg-purple-600",                      ring: "ring-purple-600" },
  { name: "Pink",   bg: "bg-pink-500",                        ring: "ring-pink-500"   },
  { name: "Orange", bg: "bg-orange-500",                      ring: "ring-orange-500" },
  { name: "Red",    bg: "bg-red-600",                         ring: "ring-red-600"    },
  { name: "Yellow", bg: "bg-yellow-400",                      ring: "ring-yellow-400" },
  { name: "Black",  bg: "bg-neutral-900 dark:bg-neutral-100", ring: "ring-neutral-700"},
  { name: "Gray",   bg: "bg-slate-400",                       ring: "ring-slate-400"  },
];

const COLOR_DOT: Record<ProductColor, string> = {
  Blue:   "bg-blue-600",
  Purple: "bg-purple-600",
  Pink:   "bg-pink-500",
  Orange: "bg-orange-500",
  Red:    "bg-red-600",
  Yellow: "bg-yellow-400",
  Black:  "bg-neutral-800",
  Gray:   "bg-slate-400",
};

const COLOR_HUES: Record<ProductColor, string> = {
  Blue:   "#3b82f6",
  Purple: "#9333ea",
  Pink:   "#ec4899",
  Orange: "#f97316",
  Red:    "#dc2626",
  Yellow: "#eab308",
  Black:  "#171717",
  Gray:   "#94a3b8",
};

// ─── Toggle helper ────────────────────────────────────────────────────────────

function toggle<T>(
  item: T,
  setState: React.Dispatch<React.SetStateAction<T[]>>,
): void {
  setState((prev) =>
    prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
  );
}

// ─── ProductPlaceholder ───────────────────────────────────────────────────────

function ProductPlaceholder({ colorName, index }: ProductPlaceholderProps) {
  const accent = COLOR_HUES[colorName];
  const shapes: ReactNode[] = [
    <path key="shirt"  d="M12 4 L6 8 L2 6 L2 14 L6 14 L6 26 L18 26 L18 14 L22 14 L22 6 L18 8 Z" fill={accent} opacity="0.85" />,
    <path key="dress"  d="M12 3 L8 9 L5 8 L3 26 L21 26 L19 8 L16 9 Z" fill={accent} opacity="0.85" />,
    <path key="hoodie" d="M12 3 C9 3 6 5 5 8 L2 9 L2 16 L6 16 L6 27 L18 27 L18 16 L22 16 L22 9 L19 8 C18 5 15 3 12 3Z M9 3.5 C10 7 14 7 15 3.5" fill={accent} opacity="0.85" />,
    <path key="pants"  d="M5 4 L19 4 L19 15 L14 15 L12 27 L10 15 L5 15 Z" fill={accent} opacity="0.85" />,
  ];
  return (
    <svg viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="24" height="30" fill="currentColor" className="text-slate-100 dark:text-neutral-800" />
      {shapes[index % shapes.length]}
    </svg>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({ product, index }: ProductCardProps) {
  const [wished, setWished] = useState(false);
  return (
    <article className="group rounded-xl overflow-hidden border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-slate-400 dark:hover:border-neutral-600 transition-all duration-200 hover:shadow-md">
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 dark:bg-neutral-800">
        <ProductPlaceholder colorName={product.color} index={index} />
        <button
          onClick={() => setWished((w) => !w)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 border cursor-pointer
            ${wished
              ? "bg-red-500 border-red-500 text-white"
              : "bg-white/70 dark:bg-neutral-900/70 border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100"
            }`}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <span className="absolute bottom-3 left-3 px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase rounded-md bg-white/80 dark:bg-neutral-900/80 text-slate-600 dark:text-slate-300 backdrop-blur-sm border border-slate-200/50 dark:border-neutral-700/50">
          {product.size}
        </span>
      </div>
      <div className="p-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-400 dark:text-neutral-500 mb-1">
          {product.brand}
        </p>
        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50 leading-snug mb-3 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-slate-900 dark:text-slate-50">
            ${product.price}
          </span>
          <span
            className={`w-4 h-4 rounded-full border-2 border-white dark:border-neutral-900 shadow-sm ${COLOR_DOT[product.color]}`}
            title={product.color}
          />
        </div>
        <button className="mt-3 w-full py-2 text-xs font-semibold tracking-wide uppercase rounded-lg border border-slate-900 dark:border-slate-50 text-slate-900 dark:text-slate-50 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-colors duration-150 cursor-pointer">
          Add to cart
        </button>
      </div>
    </article>
  );
}

// ─── FilterSection ────────────────────────────────────────────────────────────

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-200 dark:border-neutral-800 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-100 rounded"
        aria-expanded={open}
      >
        <span className="text-xs font-semibold tracking-widest uppercase text-slate-900 dark:text-slate-50">
          {title}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({ label, onRemove }: ChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-neutral-700">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-slate-300 dark:hover:bg-neutral-600 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
      >
        <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 2l8 8M10 2L2 10" />
        </svg>
      </button>
    </span>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({ onClear }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-neutral-800 flex items-center justify-center">
        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">No products found</p>
        <p className="text-xs text-slate-400 dark:text-neutral-500 mt-1">Try adjusting your filters</p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-50 text-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer"
      >
        Clear all filters
      </button>
    </div>
  );
}

// ─── FilterPanel ──────────────────────────────────────────────────────────────
// Declared at module level — never inside another component's render.

function FilterPanel({
  activeCount,
  searchTerm,
  selectedBrands,
  selectedSizes,
  selectedColors,
  priceRange,
  onSearchChange,
  onToggleBrand,
  onToggleSize,
  onToggleColor,
  onPriceChange,
  onClearAll,
  onCloseDrawer,
}: FilterPanelProps) {
  return (
    <nav aria-label="Product filters" className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-900 dark:text-slate-50">
            Filters
          </h2>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold bg-slate-900 dark:bg-slate-50 text-white dark:text-neutral-900">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors cursor-pointer"
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={onCloseDrawer}
            className="md:hidden p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
            aria-label="Close filters"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-1">

        {/* Brand */}
        <FilterSection title="Brand">
          <div className="relative mb-4">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search brands…"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
            />
          </div>
          <ul className="space-y-2.5" role="group" aria-label="Brand checkboxes">
            {BRANDS.map((brand) => {
              const checked = selectedBrands.includes(brand);
              return (
                <li key={brand}>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => onToggleBrand(brand)}
                    />
                    <span
                      className={`flex items-center justify-center w-4 h-4 rounded border transition-colors shrink-0
                        ${checked
                          ? "bg-slate-900 dark:bg-slate-50 border-slate-900 dark:border-slate-50"
                          : "bg-white dark:bg-neutral-900 border-slate-300 dark:border-neutral-600 group-hover:border-slate-600 dark:group-hover:border-neutral-400"
                        }`}
                    >
                      {checked && (
                        <svg className="w-2.5 h-2.5 text-white dark:text-neutral-900" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M1 5l3 3 7-7" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                      {brand}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterSection>

        {/* Size */}
        <FilterSection title="Size">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Size options">
            {SIZES.map((size) => {
              const active = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggleSize(size)}
                  className={`min-w-[3rem] px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer
                    ${active
                      ? "bg-slate-900 dark:bg-slate-50 border-slate-900 dark:border-slate-50 text-white dark:text-neutral-900"
                      : "bg-transparent border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-slate-400 hover:border-slate-600 dark:hover:border-neutral-400"
                    }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Price */}
        <FilterSection title="Price">
          <div className="space-y-4">
            <div className="relative h-1.5 bg-slate-200 dark:bg-neutral-700 rounded-full">
              <div
                className="absolute h-full bg-slate-900 dark:bg-slate-50 rounded-full"
                style={{
                  left:  `${(priceRange[0] / MAX_PRICE) * 100}%`,
                  right: `${100 - (priceRange[1] / MAX_PRICE) * 100}%`,
                }}
              />
              <input
                type="range" min="0" max={MAX_PRICE} step="10"
                value={priceRange[0]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const v = Math.min(Number(e.target.value), priceRange[1] - 10);
                  onPriceChange([v, priceRange[1]]);
                }}
                aria-label="Minimum price"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ zIndex: priceRange[0] > MAX_PRICE - 100 ? 5 : 3 }}
              />
              <input
                type="range" min="0" max={MAX_PRICE} step="10"
                value={priceRange[1]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const v = Math.max(Number(e.target.value), priceRange[0] + 10);
                  onPriceChange([priceRange[0], v]);
                }}
                aria-label="Maximum price"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ zIndex: 4 }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-neutral-700">
                ${priceRange[0]}
              </span>
              <span className="text-xs text-slate-400">—</span>
              <span className="px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-neutral-700">
                ${priceRange[1]}
              </span>
            </div>
          </div>
        </FilterSection>

        {/* Color */}
        <FilterSection title="Color">
          <div className="flex flex-wrap gap-2.5" role="group" aria-label="Color options">
            {COLOR_OPTIONS.map((c) => {
              const active = selectedColors.includes(c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  aria-label={c.name}
                  aria-pressed={active}
                  onClick={() => onToggleColor(c.name)}
                  className={`w-8 h-8 rounded-full transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-100
                    ${c.bg}
                    ${active
                      ? `ring-2 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900 ${c.ring}`
                      : "hover:scale-110"
                    }`}
                />
              );
            })}
          </div>
        </FilterSection>
      </div>
    </nav>
  );
}

// ─── ProductFilter (main export) ──────────────────────────────────────────────

export default function ProductFilter({ products = SAMPLE_PRODUCTS }: ProductFilterProps) {
  const [drawerOpen, setDrawerOpen]         = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes]   = useState<ProductSize[]>([]);
  const [selectedColors, setSelectedColors] = useState<ProductColor[]>([]);
  const [priceRange, setPriceRange]         = useState<[number, number]>([0, MAX_PRICE]);
  const [searchTerm, setSearchTerm]         = useState("");
  const [sortBy, setSortBy]                 = useState<SortOption>("default");

  const activeCount =
    selectedBrands.length +
    selectedSizes.length +
    selectedColors.length +
    (priceRange[0] > 0 || priceRange[1] < MAX_PRICE ? 1 : 0);

  const handleClearAll = () => {
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, MAX_PRICE]);
    setSearchTerm("");
  };

  const filteredProducts = useMemo<Product[]>(() => {
    let list = [...products];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
      );
    }
    if (selectedBrands.length) list = list.filter((p) => selectedBrands.includes(p.brand));
    if (selectedSizes.length)  list = list.filter((p) => selectedSizes.includes(p.size));
    if (selectedColors.length) list = list.filter((p) => selectedColors.includes(p.color));
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sortBy === "price-asc")  list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "name")       list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, searchTerm, selectedBrands, selectedSizes, selectedColors, priceRange, sortBy]);

  // Props object built once per render and spread into both FilterPanel instances
  const filterPanelProps: FilterPanelProps = {
    activeCount,
    searchTerm,
    selectedBrands,
    selectedSizes,
    selectedColors,
    priceRange,
    onSearchChange: setSearchTerm,
    onToggleBrand:  (brand)  => toggle(brand, setSelectedBrands),
    onToggleSize:   (size)   => toggle<ProductSize>(size, setSelectedSizes),
    onToggleColor:  (color)  => toggle<ProductColor>(color, setSelectedColors),
    onPriceChange:  setPriceRange,
    onClearAll:     handleClearAll,
    onCloseDrawer:  () => setDrawerOpen(false),
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-slate-900 dark:text-slate-50">
      {/* ── Mobile overlay ──────────────────────────────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile drawer ───────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-neutral-950 border-r border-slate-200 dark:border-neutral-800 md:hidden transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Product filters"
      >
        <FilterPanel {...filterPanelProps} />
      </aside>

      <div className="flex">
        {/* ── Desktop sidebar ─────────────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 border-r border-slate-200 dark:border-neutral-800 min-h-screen sticky top-0">
          <FilterPanel {...filterPanelProps} />
        </aside>

        {/* ── Main content ────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="md:hidden flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-expanded={drawerOpen}
              aria-controls="mobile-filter-drawer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
              </svg>
              Filters
              {activeCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold bg-slate-900 dark:bg-slate-50 text-white dark:text-neutral-900">
                  {activeCount}
                </span>
              )}
            </button>

            <p className="text-sm text-slate-400 dark:text-neutral-500">
              <span className="font-semibold text-slate-900 dark:text-slate-50">{filteredProducts.length}</span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>

            <div className="flex-1" />

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSortBy(e.target.value as SortOption)
                }
                className="appearance-none pl-3 pr-8 py-2 text-xs font-medium bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 cursor-pointer"
              >
                <option value="default">Sort: Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="name">Name A–Z</option>
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div className="flex flex-wrap gap-2 px-4 sm:px-6 py-3 border-b border-slate-100 dark:border-neutral-800/60">
              {selectedBrands.map((b) => (
                <Chip key={b} label={b} onRemove={() => toggle(b, setSelectedBrands)} />
              ))}
              {selectedSizes.map((s) => (
                <Chip key={s} label={s} onRemove={() => toggle<ProductSize>(s, setSelectedSizes)} />
              ))}
              {selectedColors.map((c) => (
                <Chip key={c} label={c} onRemove={() => toggle<ProductColor>(c, setSelectedColors)} />
              ))}
              {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
                <Chip
                  label={`$${priceRange[0]} – $${priceRange[1]}`}
                  onRemove={() => setPriceRange([0, MAX_PRICE])}
                />
              )}
            </div>
          )}

          {/* Product grid */}
          <div className="p-4 sm:p-6">
            {filteredProducts.length === 0 ? (
              <EmptyState onClear={handleClearAll} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}