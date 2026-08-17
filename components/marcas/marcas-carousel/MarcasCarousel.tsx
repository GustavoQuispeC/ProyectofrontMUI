"use client";

import { useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import { useMarcasPublicas } from "@/features/store/marcas/useMarcasPublicas";
import { ListarMarca } from "@/features/dashboard/marca/Marca.types";

const MAX_MARCAS = 15;

function getInitials(nombre: string) {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

interface MarcaAvatarProps {
  marca: ListarMarca;
  onSelect: (nombre: string) => void;
}

function MarcaAvatar({ marca, onSelect }: MarcaAvatarProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(marca.nombre)}
      title={marca.nombre}
      className="group flex w-24 shrink-0 snap-start flex-col items-center gap-2 focus:outline-none"
    >
      <span className="flex h-19 w-19 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
        {marca.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={marca.logo} alt={marca.nombre} className="h-16 w-16 object-contain" />
        ) : (
          <span className="text-sm font-bold text-slate-950">{getInitials(marca.nombre)}</span>
        )}
      </span>
      <span className="w-full truncate text-center text-xs font-medium text-slate-600 group-hover:text-slate-950">
        {marca.nombre}
      </span>
    </button>
  );
}

export default function MarcasCarousel() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { marcas, loading } = useMarcasPublicas();

  const marcasActivas = useMemo(() => marcas.filter((marca) => marca.isActive).slice(0, MAX_MARCAS), [marcas]);

  const handleSelect = (nombre: string) => {
    router.push(`/productFilter?brand=${encodeURIComponent(nombre)}`);
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const amount = container.clientWidth * 0.8;
    container.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!loading && marcasActivas.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-slate-200 bg-white px-2 py-6 sm:px-4">
      <div className="mx-auto flex max-w-7xl items-center gap-2">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Desplazar marcas a la izquierda"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:text-slate-950"
        >
          <ChevronLeftIcon sx={{ fontSize: 20 }} />
        </button>

        <div
          ref={scrollRef}
          className="scrollbar-none flex flex-1 snap-x snap-proximity gap-5 overflow-x-auto scroll-smooth px-1 py-2"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex w-24 shrink-0 flex-col items-center gap-2">
                  <span className="h-19 w-19 animate-pulse rounded-full bg-slate-100" />
                  <span className="h-3 w-14 animate-pulse rounded bg-slate-100" />
                </div>
              ))
            : marcasActivas.map((marca) => <MarcaAvatar key={marca.id} marca={marca} onSelect={handleSelect} />)}

          {!loading && (
            <button
              type="button"
              onClick={() => router.push("/productFilter")}
              className="group flex w-24 shrink-0 snap-start flex-col items-center gap-2 focus:outline-none"
            >
              <span className="flex h-19 w-19 items-center justify-center rounded-full border border-dashed border-slate-300 bg-white text-slate-400 transition-colors duration-300 group-hover:border-slate-950 group-hover:text-slate-950">
                <AddIcon sx={{ fontSize: 22 }} />
              </span>
              <span className="w-full truncate text-center text-xs font-medium text-slate-600 group-hover:text-slate-950">
                Más marcas
              </span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Desplazar marcas a la derecha"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:text-slate-950"
        >
          <ChevronRightIcon sx={{ fontSize: 20 }} />
        </button>
      </div>
    </div>
  );
}
