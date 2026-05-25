"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductFilterSidebar } from "@/components/ProductFilterSidebar";
import { Product, ProductGrid, PRODUCTS, ProductToolbar } from "@/components/product";
import Pagination from "@/components/ui/Pagination";
import type { ProductFilters } from "@/components/ProductFilterSidebar/filter.types";
import { MAX_PRICE } from "@/components/ProductFilterSidebar/constants";
import AddToCartModal from "@/components/cartdrawer/AddToCartModal";
import { upsertCartItem } from "@/components/cartdrawer/cartService";

const DEFAULT_FILTERS: ProductFilters = {
  search: "",
  brands: [],
  categories: [],
  offers: [],
  ratings: [],
  priceMax: MAX_PRICE,
};

const SORT_OPTIONS = ["Destacados", "Precio menor", "Precio mayor", "Mejor valorados"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

function parseList(value: string | null) {
  return value ? value.split(",").filter(Boolean) : [];
}

function parseNumberList(value: string | null) {
  return parseList(value).map((item) => Number(item)).filter((value) => Number.isFinite(value));
}

function buildSearchParams(filters: ProductFilters, sortBy: SortOption) {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.categories.length) params.set("category", filters.categories.join(","));
  if (filters.brands.length) params.set("brand", filters.brands.join(","));
  if (filters.offers.length) params.set("offer", filters.offers.join(","));
  if (filters.ratings.length) params.set("rating", filters.ratings.join(","));
  if (filters.priceMax !== MAX_PRICE) params.set("priceMax", String(filters.priceMax));
  if (sortBy !== "Destacados") params.set("sortBy", sortBy);

  return params.toString();
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>("Destacados");
  const [readyToSync, setReadyToSync] = useState(false);
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const lastUrlRef = useRef<string>("");

  useEffect(() => {
    if (!searchParams) return;

    setFilters({
      search: searchParams.get("search") ?? "",
      categories: parseList(searchParams.get("category")),
      brands: parseList(searchParams.get("brand")),
      offers: parseList(searchParams.get("offer")),
      ratings: parseNumberList(searchParams.get("rating")),
      priceMax: Number(searchParams.get("priceMax")) || MAX_PRICE,
    });

    const paramSort = searchParams.get("sortBy");
    if (paramSort && SORT_OPTIONS.includes(paramSort as SortOption)) {
      setSortBy(paramSort as SortOption);
    } else {
      setSortBy("Destacados");
    }

    setReadyToSync(true);
  }, [searchParams]);

  // Sincronizar filtros a URL solo cuando cambien, evitando renders innecesarios
  useEffect(() => {
    if (!readyToSync) return;

    const queryString = buildSearchParams(filters, sortBy);
    const newUrl = `/productFilter${queryString ? `?${queryString}` : ""}`;
    
    // Solo hacer replace si la URL cambió realmente
    if (lastUrlRef.current !== newUrl) {
      lastUrlRef.current = newUrl;
      router.replace(newUrl);
    }
  }, [filters, sortBy, readyToSync, router]);

  useEffect(() => {
    setPage(1);
  }, [filters, sortBy]);

  const handleAddToCart = (product: Product) => {
    upsertCartItem(
      {
        id: product.id,
        nombre: product.name,
        precio: product.price,
        imagen: product.image ?? "",
      },
      1,
    );
    setSelectedProduct(product);
    setAddModalOpen(true);
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    const filtered = PRODUCTS.filter((product) => {
      const textMatch =
        !normalizedSearch ||
        [product.name, product.brand, product.category].some((field) =>
          field.toLowerCase().includes(normalizedSearch),
        );

      const categoriesMatch =
        filters.categories.length === 0 || filters.categories.includes(product.category);
      const brandsMatch = filters.brands.length === 0 || filters.brands.includes(product.brand);
      const ratingsMatch = filters.ratings.length === 0 || filters.ratings.includes(product.rating);
      const priceMatch = product.price <= filters.priceMax;
      const offersMatch =
        filters.offers.length === 0 ||
        filters.offers.every((offer) => {
          if (offer === "Descuento") return product.hasDiscount;
          if (offer === "Envío gratis") return product.freeShipping === true;
          return true;
        });

      return textMatch && categoriesMatch && brandsMatch && ratingsMatch && priceMatch && offersMatch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "Precio mayor") return b.price - a.price;
      if (sortBy === "Precio menor") return a.price - b.price;
      if (sortBy === "Mejor valorados") return b.rating - a.rating;
      if (sortBy === "Destacados") {
        if (Number(b.hasDiscount) !== Number(a.hasDiscount)) {
          return Number(b.hasDiscount) - Number(a.hasDiscount);
        }
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.price - a.price;
      }
      return 0;
    });
  }, [filters, sortBy]);

  const ITEMS_PER_PAGE = 48;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-400 mx-auto flex">
        <ProductFilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          onClear={() => setFilters(DEFAULT_FILTERS)}
        />

        <main className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto p-6">
            <ProductToolbar
              total={filteredProducts.length}
              sortBy={sortBy}
              onSortChange={(value) => setSortBy(value as SortOption)}
              onOpenFilters={() => setMobileFiltersOpen(true)}
            />

            {paginatedProducts.length > 0 ? (
              <>
                <ProductGrid products={paginatedProducts} onAdd={handleAddToCart} />
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-300">
                <p className="text-xl font-semibold">No se encontraron productos con esos filtros.</p>
                <p className="mt-2 text-sm">Ajusta la búsqueda o borra los filtros para ver más productos.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {isAddModalOpen && selectedProduct && (
        <AddToCartModal
          isOpen={isAddModalOpen}
          onClose={() => setAddModalOpen(false)}
          producto={{
            id: selectedProduct.id,
            nombre: selectedProduct.name,
            precio: selectedProduct.price,
            imagen: selectedProduct.image ?? "",
          }}
        />
      )}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative z-10 w-80 max-w-full h-full bg-white dark:bg-neutral-900 overflow-auto">
            <div className="p-4 flex items-center justify-between border-b border-slate-200">
              <h3 className="text-lg font-semibold">Filtros</h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="text-sm px-3 py-1 rounded-xl border bg-white dark:bg-neutral-800"
              >
                Cerrar
              </button>
            </div>
            <ProductFilterSidebar
              filters={filters}
              onFiltersChange={(f) => {
                setFilters(f);
              }}
              onClear={() => setFilters(DEFAULT_FILTERS)}
              className="w-full min-h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}