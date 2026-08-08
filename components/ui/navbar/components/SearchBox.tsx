"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useCategoriasPublicas } from "@/features/dashboard/categoria/hooks/useCategorias";
import { useProductosPublicos } from "@/features/store/productos/useProductosPublicos";
import { RELATED_BRANDS } from "./search.config";

interface SearchBoxProps {
  className?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
}

export function SearchBox({ className = "", autoFocus, onNavigate }: SearchBoxProps) {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const id = setTimeout(() => setDebouncedTerm(term), 300);
    return () => clearTimeout(id);
  }, [term]);

  const { categorias } = useCategoriasPublicas();
  const trimmed = debouncedTerm.trim();

  const searchParams = useMemo(
    () => ({
      pagina: 1,
      tamanoPagina: 6,
      busqueda: trimmed || undefined,
    }),
    [trimmed],
  );

  const { productos } = useProductosPublicos(searchParams, trimmed.length > 0);

  const productSuggestions = productos
    .filter((p) => p.nombre.toLowerCase().includes(trimmed.toLowerCase()))
    .map((p) => p.nombre);
  const suggestions = productSuggestions.length > 0 ? productSuggestions : [];
  const showPanel = open && term.trim().length > 0;

  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const goToSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      const newUrl = trimmed ? `/productFilter?search=${encodeURIComponent(trimmed)}` : "/productFilter";
      router.push(newUrl);
      setOpen(false);
      onNavigate?.();
    },
    [router, onNavigate],
  );

  const goToCategory = useCallback(
    (categoryLabel: string) => {
      router.push(`/productFilter?category=${encodeURIComponent(categoryLabel)}`);
      setOpen(false);
      onNavigate?.();
    },
    [router, onNavigate],
  );

  const goToBrand = useCallback(
    (brandLabel: string) => {
      router.push(`/productFilter?brand=${encodeURIComponent(brandLabel)}`);
      setOpen(false);
      onNavigate?.();
    },
    [router, onNavigate],
  );

  const relatedCategories = categorias.slice(0, 9).map((c) => c.nombre);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="flex h-11 w-full items-center overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-orange-400">
        <input
          type="text"
          autoFocus={autoFocus}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && goToSearch(term)}
          placeholder="Buscar productos"
          className="h-full w-full flex-1 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none"
        />
        {term && (
          <button
            type="button"
            aria-label="Limpiar búsqueda"
            onClick={() => setTerm("")}
            className="flex h-full w-9 items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <CloseIcon fontSize="small" />
          </button>
        )}
        <button
          type="button"
          aria-label="Buscar"
          onClick={() => goToSearch(term)}
          className="flex h-full w-11 shrink-0 items-center justify-center bg-gray-900 text-white transition-colors hover:bg-orange-600"
        >
          <SearchIcon fontSize="small" />
        </button>
      </div>

      {showPanel && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[70vh] overflow-y-auto rounded-xl border border-border-base bg-surface p-4 shadow-2xl sm:left-1/2 sm:right-auto sm:w-[min(92vw,820px)] sm:-translate-x-1/2">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Sugerencias</p>
              {suggestions.length === 0 ? (
                <p className="text-sm text-text-secondary">Sin coincidencias. Presiona Enter para buscar igual.</p>
              ) : (
                <ul className="space-y-1.5">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion}>
                      <button
                        type="button"
                        onClick={() => goToSearch(suggestion)}
                        className="w-full text-left text-sm text-text-primary hover:text-orange-600"
                      >
                        {suggestion}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="hidden sm:block">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Marcas relacionadas
              </p>
              <ul className="space-y-1.5">
                {RELATED_BRANDS.slice(0, 8).map((brand) => (
                  <li key={brand}>
                    <button
                      type="button"
                      onClick={() => goToBrand(brand)}
                      className="w-full text-left text-sm text-text-primary hover:text-orange-600"
                    >
                      {brand}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden sm:block">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Categorías relacionadas
              </p>
              <ul className="space-y-1.5">
                {relatedCategories.map((label) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => goToCategory(label)}
                      className="w-full text-left text-sm text-text-primary hover:text-orange-600"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
