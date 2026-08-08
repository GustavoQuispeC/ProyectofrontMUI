"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductFilterSidebar } from "@/components/ProductFilterSidebar";
import { Product, ProductGrid, ProductToolbar } from "@/components/product";
import Pagination from "@/components/ui/Pagination";
import type { ProductFilters } from "@/components/ProductFilterSidebar/filter.types";
import { MAX_PRICE } from "@/components/ProductFilterSidebar/constants";
import AddToCartModal from "@/components/cartdrawer/AddToCartModal";
import { upsertCartItem } from "@/components/cartdrawer/cartService";
import { useProductosPublicos } from "@/features/store/productos/useProductosPublicos";
import { useCategoriasPublicas } from "@/features/dashboard/categoria/hooks/useCategorias";
import { useMarcasPublicas } from "@/features/store/marcas/useMarcasPublicas";
import { ListarProducto } from "@/features/dashboard/producto/Producto.types";

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
  return parseList(value)
    .map((item) => Number(item))
    .filter((value) => Number.isFinite(value));
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

function mapSortBy(sortBy: SortOption): { ordenarPor?: string; ordenamiento?: "asc" | "desc" } {
  if (sortBy === "Precio menor") return { ordenarPor: "precio", ordenamiento: "asc" };
  if (sortBy === "Precio mayor") return { ordenarPor: "precio", ordenamiento: "desc" };
  return {};
}

function mapProductoToStore(producto: ListarProducto): Product {
  const principal = producto.imagenes.find((img) => img.esPrincipal) ?? producto.imagenes[0];
  const precio = producto.precios[0]?.precio ?? producto.costoActual ?? 0;

  return {
    id: producto.id,
    name: producto.nombre,
    brand: producto.marcaNombre,
    category: producto.categoriaNombre,
    price: precio,
    image: principal?.url ?? null,
    rating: 0,
    inStock: true,
    hasDiscount: false,
    freeShipping: false,
  };
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

  const { categorias } = useCategoriasPublicas();
  const { marcas } = useMarcasPublicas();

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

    if (lastUrlRef.current !== newUrl) {
      lastUrlRef.current = newUrl;
      router.replace(newUrl);
    }
  }, [filters, sortBy, readyToSync, router]);

  useEffect(() => {
    setPage(1);
  }, [filters, sortBy]);

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

  const requestParams = useMemo(
    () => ({
      pagina: page,
      tamanoPagina: 20,
      busqueda: filters.search || undefined,
      categoriaId,
      marcaId,
      ...mapSortBy(sortBy),
    }),
    [page, filters.search, categoriaId, marcaId, sortBy],
  );

  const { productos, paginacion, loading } = useProductosPublicos(requestParams);

  const storeProducts = useMemo(() => productos.map(mapProductoToStore), [productos]);

  const availableCategories = useMemo(() => categorias.map((c) => c.nombre), [categorias]);
  const availableBrands = useMemo(() => marcas.map((m) => m.nombre), [marcas]);

  const totalPages = useMemo(() => Math.max(1, paginacion?.totalPaginas ?? 1), [paginacion]);

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
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-400 mx-auto flex">
        <ProductFilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          onClear={() => setFilters(DEFAULT_FILTERS)}
          categories={availableCategories}
          brands={availableBrands}
        />

        <main className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto p-6">
            <ProductToolbar
              total={paginacion?.totalRegistros ?? storeProducts.length}
              sortBy={sortBy}
              onSortChange={(value) => setSortBy(value as SortOption)}
              onOpenFilters={() => setMobileFiltersOpen(true)}
            />

            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-300">
                <p className="text-xl font-semibold">Cargando productos...</p>
              </div>
            ) : storeProducts.length > 0 ? (
              <>
                <ProductGrid products={storeProducts} onAdd={handleAddToCart} />
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
