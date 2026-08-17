"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductFilterSidebar } from "@/components/ProductFilterSidebar";
import { Product, ProductGrid, ProductToolbar, mapProductoToStore } from "@/components/productos_home";
import Pagination from "@/components/ui/Pagination";
import type { ProductFilters } from "@/components/ProductFilterSidebar/filter.types";
import { MAX_PRICE } from "@/components/ProductFilterSidebar/constants";
import AddToCartModal from "@/components/cartdrawer/AddToCartModal";
import { upsertCartItem } from "@/components/cartdrawer/cartService";
import { useProductosPublicos } from "@/features/store/productos/useProductosPublicos";
import { useCategoriasPublicas } from "@/features/dashboard/categoria/hooks/useCategorias";
import { useMarcasPublicas } from "@/features/store/marcas/useMarcasPublicas";
import MarcasCarousel from "@/components/marcas/marcas-carousel/MarcasCarousel";

const DEFAULT_FILTERS: ProductFilters = {
  search: "",
  brands: [],
  categories: [],
  offers: [],
  ratings: [],
  priceMax: MAX_PRICE,
};

const SORT_OPTIONS = ["Mayor a menor", "Menor a mayor", "Ascendente", "Descendente"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

const PAGE_SIZE = 20;
const CLIENT_FETCH_SIZE = 500;

function parseList(value: string | null) {
  return value ? value.split(",").filter(Boolean) : [];
}

function parseNumberList(value: string | null) {
  return parseList(value)
    .map((item) => Number(item))
    .filter((value) => Number.isFinite(value));
}

function parseFiltersFromParams(searchParams: URLSearchParams | null): ProductFilters {
  if (!searchParams) return DEFAULT_FILTERS;

  return {
    search: searchParams.get("search") ?? "",
    categories: parseList(searchParams.get("category")),
    brands: parseList(searchParams.get("brand")),
    offers: parseList(searchParams.get("offer")),
    ratings: parseNumberList(searchParams.get("rating")),
    priceMax: Number(searchParams.get("priceMax")) || MAX_PRICE,
  };
}

function parseSortBy(searchParams: URLSearchParams | null): SortOption {
  const value = searchParams?.get("sortBy");
  return value && SORT_OPTIONS.includes(value as SortOption) ? (value as SortOption) : "Mayor a menor";
}

function parsePage(searchParams: URLSearchParams | null): number {
  const value = Number(searchParams?.get("page"));
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function buildSearchParams(filters: ProductFilters, sortBy: SortOption, page: number) {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.categories.length) params.set("category", filters.categories.join(","));
  if (filters.brands.length) params.set("brand", filters.brands.join(","));
  if (filters.offers.length) params.set("offer", filters.offers.join(","));
  if (filters.ratings.length) params.set("rating", filters.ratings.join(","));
  if (filters.priceMax !== MAX_PRICE) params.set("priceMax", String(filters.priceMax));
  params.set("sortBy", sortBy);
  if (page > 1) params.set("page", String(page));

  return params.toString();
}

function mapSortBy(sortBy: SortOption): { ordenarPor?: string; ordenamiento?: "asc" | "desc" } {
  switch (sortBy) {
    case "Mayor a menor":
      return { ordenarPor: "precio", ordenamiento: "desc" };
    case "Menor a mayor":
      return { ordenarPor: "precio", ordenamiento: "asc" };
    case "Ascendente":
      return { ordenarPor: "nombre", ordenamiento: "asc" };
    case "Descendente":
      return { ordenarPor: "nombre", ordenamiento: "desc" };
    default:
      return { ordenarPor: "precio", ordenamiento: "desc" };
  }
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const filters = useMemo(() => parseFiltersFromParams(searchParams), [searchParams]);
  const sortBy = useMemo(() => parseSortBy(searchParams), [searchParams]);
  const page = useMemo(() => parsePage(searchParams), [searchParams]);

  const updateUrl = useCallback(
    (nextFilters: ProductFilters, nextSortBy: SortOption, nextPage: number) => {
      const queryString = buildSearchParams(nextFilters, nextSortBy, nextPage);
      router.replace(`/productFilter${queryString ? `?${queryString}` : ""}`);
    },
    [router],
  );

  const handleFiltersChange = useCallback(
    (nextFilters: ProductFilters) => updateUrl(nextFilters, sortBy, 1),
    [updateUrl, sortBy],
  );

  const handleSortChange = useCallback(
    (value: string) => {
      const nextSortBy = SORT_OPTIONS.includes(value as SortOption) ? (value as SortOption) : "Mayor a menor";
      updateUrl(filters, nextSortBy, 1);
    },
    [updateUrl, filters],
  );

  const handlePageChange = useCallback(
    (nextPage: number) => updateUrl(filters, sortBy, nextPage),
    [updateUrl, filters, sortBy],
  );

  const handleClear = useCallback(() => {
    router.replace("/productFilter");
  }, [router]);

  const { categorias } = useCategoriasPublicas();
  const { marcas } = useMarcasPublicas();

  const categoriaId = useMemo(() => {
    if (filters.categories.length !== 1) return undefined;
    const found = categorias.find((c) => c.nombre === filters.categories[0]);
    return found?.id;
  }, [filters.categories, categorias]);

  const marcaId = useMemo(() => {
    if (filters.brands.length !== 1) return undefined;
    const found = marcas.find((m) => m.nombre === filters.brands[0]);
    return found?.id;
  }, [filters.brands, marcas]);

  // La API pública solo admite un único categoriaId/marcaId y no busca por marca.
  // Cuando hay búsqueda de texto o más de una categoría/marca seleccionada,
  // traemos un lote amplio y filtramos/paginamos en el cliente.
  const clientMode = Boolean(filters.search) || filters.categories.length > 1 || filters.brands.length > 1;

  const requestParams = useMemo(
    () => ({
      pagina: clientMode ? 1 : page,
      tamanoPagina: clientMode ? CLIENT_FETCH_SIZE : PAGE_SIZE,
      busqueda: clientMode ? undefined : filters.search || undefined,
      categoriaId,
      marcaId,
      ...mapSortBy(sortBy),
    }),
    [clientMode, page, filters.search, categoriaId, marcaId, sortBy],
  );

  const { productos, paginacion, loading } = useProductosPublicos(requestParams);

  const storeProducts = useMemo(() => productos.map(mapProductoToStore), [productos]);

  const availableCategories = useMemo(() => categorias.map((c) => c.nombre), [categorias]);
  const availableBrands = useMemo(() => marcas.map((m) => m.nombre), [marcas]);

  const searchTerm = filters.search.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!clientMode) return storeProducts;

    return storeProducts.filter((product) => {
      if (searchTerm) {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;
      if (product.price > filters.priceMax) return false;

      return true;
    });
  }, [clientMode, storeProducts, searchTerm, filters.categories, filters.brands, filters.priceMax]);

  const displayedProducts = useMemo(() => {
    if (!clientMode) return storeProducts;
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [clientMode, storeProducts, filteredProducts, page]);

  const totalPages = useMemo(() => {
    if (clientMode) return Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
    return Math.max(1, paginacion?.totalPaginas ?? 1);
  }, [clientMode, filteredProducts, paginacion]);

  const totalCount = clientMode ? filteredProducts.length : (paginacion?.totalRegistros ?? storeProducts.length);

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

  return (
    <div className="min-h-screen bg-white">
      <MarcasCarousel />

      <div className="max-w-7xl mx-auto flex">
        <ProductFilterSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClear={handleClear}
          categories={availableCategories}
          brands={availableBrands}
        />

        <main className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto p-6">
            <ProductToolbar
              total={totalCount}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              onOpenFilters={() => setMobileFiltersOpen(true)}
            />

            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                <p className="text-xl font-semibold">Cargando productos...</p>
              </div>
            ) : displayedProducts.length > 0 ? (
              <>
                <ProductGrid products={displayedProducts} onAdd={handleAddToCart} />
                <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
              </>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                <p className="text-xl font-semibold">No se encontraron productos con esos filtros.</p>
                <p className="mt-2 text-sm">Ajusta la búsqueda o borra los filtros para ver más productos.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {isAddModalOpen && selectedProduct && (
        <AddToCartModal
          key={selectedProduct.id}
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
          <div className="relative z-10 w-80 max-w-full h-full bg-white overflow-auto">
            <div className="p-4 flex items-center justify-between border-b border-slate-200">
              <h3 className="text-lg font-semibold">Filtros</h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="text-sm px-3 py-1 rounded-xl border bg-white"
              >
                Cerrar
              </button>
            </div>
            <ProductFilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClear={handleClear}
              categories={availableCategories}
              brands={availableBrands}
              className="w-full min-h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
