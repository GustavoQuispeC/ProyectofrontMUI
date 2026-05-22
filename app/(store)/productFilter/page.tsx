"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductFilterSidebar } from "@/components/ProductFilterSidebar";
import { ProductGrid, PRODUCTS, ProductToolbar } from "@/components/product";
import type { ProductFilters } from "@/components/ProductFilterSidebar/filter.types";
import { MAX_PRICE } from "@/components/ProductFilterSidebar/constants";

const DEFAULT_FILTERS: ProductFilters = {
  search: "",
  brands: [],
  categories: [],
  offers: [],
  ratings: [],
  priceMax: MAX_PRICE,
};

function parseList(value: string | null) {
  return value ? value.split(",").filter(Boolean) : [];
}

function parseNumberList(value: string | null) {
  return parseList(value).map((item) => Number(item)).filter((value) => Number.isFinite(value));
}

export default function Page() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);

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
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return PRODUCTS.filter((product) => {
      const textMatch =
        !normalizedSearch ||
        [product.name, product.brand, product.category]
          .some((field) => field.toLowerCase().includes(normalizedSearch));

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
  }, [filters]);

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
            <ProductToolbar total={filteredProducts.length} />

            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-300">
                <p className="text-xl font-semibold">No se encontraron productos con esos filtros.</p>
                <p className="mt-2 text-sm">Ajusta la búsqueda o borra los filtros para ver más productos.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}