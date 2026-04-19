"use client";
import { useMemo, useRef, useState, useEffect } from "react";

interface CardData {
  title: string;
  img: string;
  description?: string;
}

interface CardProps {
  title: string;
  img: string;
  description?: string;
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Categorias() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const cards: CardData[] = useMemo(
    () => [
      {
        title: "Cementos",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FCEMENTOS.png?alt=media&token=5d3cda29-4bb0-4995-8a06-8ba682fad27d",
        description: "Distribuidor autorizado",
      },
      {
        title: "Ladrillos",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FLADRILLOS.png?alt=media&token=d5e605cf-989e-4687-9117-6f7d9ae937a7",
      },
      {
        title: "Clavos",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FCLAVOS.png?alt=media&token=b28b962f-bab1-4ab4-a8af-39554ac19f70",
      },
      {
        title: "Perfiles y Tubos",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FPERFILES.png?alt=media&token=a9a0deef-eb83-458a-8275-72cf3b3d9338",
      },
      {
        title: "Alambres",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FALAMBRES.png?alt=media&token=90569c1e-7376-4c63-8de0-bd811dac7435",
      },
      {
        title: "Teja Andina",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FTEJA%20ANDINA.png?alt=media&token=783b20f5-7e8d-4cce-bc89-b8a85f45d2c2",
      },
      {
        title: "Tuberías, tanques y accesorios",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FTUBERIAS.png?alt=media&token=11c93a02-c2fa-4d91-8687-1dcc0d76127e",
      },
      {
        title: "Fierros",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FFIERROS.png?alt=media&token=bed4ba9b-a40d-40b3-a0c3-e0dff043de68",
      },
      {
        title: "Calaminas",
        img: "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Categorias%2FCALAMINA.png?alt=media&token=58b0c4dc-2a02-467e-8bf3-4edc4a0f9ec3",
      },
    ],
    [],
  );

  const updateScrollButtons = () => {
    const el = scrollerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scrollByCards = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;

    const cardWidth = el.querySelector<HTMLElement>("[data-card]")?.offsetWidth ?? 280;
    const gap = 16;
    const delta = (cardWidth + gap) * (dir === "left" ? -1 : 1);

    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const Card = ({ title, img }: CardProps) => (
    <button
      type="button"
      data-card
      className="group relative overflow-hidden rounded-2xl text-left
      bg-white dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
      shadow-sm hover:shadow-md
      transition-all duration-300
      hover:-translate-y-1
      shrink-0
      w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px]
      snap-start"
    >
      {/* Imagen */}
      <div className="relative h-[160px] overflow-hidden rounded-t-2xl">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* overlay sutil */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition" />
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-white">{title}</h3>

        <div className="flex items-center gap-1 text-orange-600 font-medium text-sm group-hover:gap-2 transition-all">
          <span>Explorar</span>
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </button>
  );

  return (
    <section className="bg-gray-50 dark:bg-gray-900 ">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 sm:py-16">
        {/* Header mejorado */}
        <div className="mx-auto mb-8 sm:mb-10 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            Categorías
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-blue-900 dark:text-white">
            Encuentra lo que necesitas
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explora nuestro catálogo completo de materiales de construcción organizados por categoría
          </p>
        </div>

        {/* Carrusel con controles mejorados */}
        <div className="relative">
          {/* Botón izquierdo */}
          <button
            type="button"
            onClick={() => scrollByCards("left")}
            disabled={!canScrollLeft}
            className={[
              "hidden md:flex items-center justify-center",
              "absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4",
              "h-11 w-11 rounded-full",
              "bg-white dark:bg-gray-800 backdrop-blur",
              "border-2 border-gray-200 dark:border-gray-700",
              "shadow-lg hover:shadow-xl transition-all duration-300",
              "text-gray-700 dark:text-gray-200",
              "hover:scale-110 active:scale-95",
              "disabled:opacity-0 disabled:pointer-events-none",
            ].join(" ")}
            aria-label="Desplazar a la izquierda"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>

          {/* Botón derecho */}
          <button
            type="button"
            onClick={() => scrollByCards("right")}
            disabled={!canScrollRight}
            className={[
              "hidden md:flex items-center justify-center",
              "absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4",
              "h-11 w-11 rounded-full",
              "bg-white dark:bg-gray-800 backdrop-blur",
              "border-2 border-gray-200 dark:border-gray-700",
              "shadow-lg hover:shadow-xl transition-all duration-300",
              "text-gray-700 dark:text-gray-200",
              "hover:scale-110 active:scale-95",
              "disabled:opacity-0 disabled:pointer-events-none",
            ].join(" ")}
            aria-label="Desplazar a la derecha"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>

          {/* Scroller */}
          <div
            ref={scrollerRef}
            className={[
              "flex gap-4 sm:gap-5",
              "overflow-x-auto overscroll-x-contain",
              "scroll-smooth",
              "snap-x snap-mandatory",
              "px-1 md:px-0",
              "pb-4",
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            ].join(" ")}
          >
            {cards.map((card, index) => (
              <Card key={`${card.title}-${index}`} title={card.title} img={card.img} description={card.description} />
            ))}
          </div>

          {/* Indicadores de scroll (mobile) */}
          <div className="md:hidden flex justify-center gap-1.5 mt-5">
            {cards.map((_, index) => (
              <div key={index} className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
