"use client";

import { Carousel, Navbar, Footer, Categorias, Marcas } from "@/components";
import { ArrowUpward, FmdGood, Close } from "@mui/icons-material";
import { useEffect, useState } from "react";

const TIENDAS = [
  {
    id: 1,
    nombre: "Tienda Libertad",
    direccion: "Jr. Libertad 824",
    whatsapp: "51904193374",
  },
  {
    id: 2,
    nombre: "Tienda Salamanca",
    direccion: "Jr. Salamanca 858",
    whatsapp: "51904193374",
  },
  {
    id: 3,
    nombre: "Almacén Principal",
    direccion: "Cruce Pucacruz",
    whatsapp: "51904193374",
  },
];

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const imagenesBanner = [
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Carousel%2FCAROUSEL_1.png?alt=media&token=a5218405-7e1c-4e24-a996-07d33845c113",
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Carousel%2FCAROUSEL_2.png?alt=media&token=399808d1-f1d3-4b5e-b1cf-bcb729467b9b",
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Carousel%2FCAROUSEL_3.png?alt=media&token=65e1c03d-1dfc-47b7-8ed7-9c654daff179",
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWhatsAppClick = (whatsapp: string, tienda: string) => {
    const message = encodeURIComponent(`Hola, quiero cotizar materiales desde ${tienda}. ¿Me pueden ayudar?`);
    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
    setShowMenu(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="grow">
        <Carousel images={imagenesBanner} />
        <Categorias />
        <Marcas />

        {/* CONTROLES FLOTANTES */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
          {/* BOTÓN IR ARRIBA */}
          <button
            onClick={scrollToTop}
            className={[
              "bg-blue-950 text-white dark:bg-white dark:text-blue-950",
              "h-12 w-12 rounded-full shadow-2xl border border-white/10",
              "flex items-center justify-center",
              "transition-all duration-500",
              showBackToTop ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none",
            ].join(" ")}
            aria-label="Subir al inicio"
          >
            <ArrowUpward fontSize="small" />
          </button>

          {/* MENÚ WHATSAPP */}
          <div className="flex flex-col items-end gap-3">
            {showMenu && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-40 bg-black/5 backdrop-blur-sm" onClick={() => setShowMenu(false)} />

                {/* Panel */}
                <div className="relative z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Header verde */}
                  <div className="bg-linear-to-r from-green-500 to-green-600 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
                        <path d="M16 0a16 16 0 0 0-13.84 24.08L0 32l8.16-2.16A16 16 0 1 0 16 0zm0 29.33a13.22 13.22 0 0 1-6.72-1.8l-.48-.28-4.84 1.28 1.3-4.78-.32-.5A13.27 13.27 0 1 1 16 29.33zm7.38-9.38c-.4-.2-2.36-1.17-2.73-1.3s-.63-.2-.9.2-1.04 1.3-1.28 1.56-.48.3-.84.1a10.94 10.94 0 0 1-3.36-2.06 12.7 12.7 0 0 1-2.36-3.02c-.24-.4 0-.62.18-.84s.42-.52.63-.8c.2-.28.26-.46.38-.76s.06-.58 0-.8c-.1-.24-.94-2.4-1.3-3.3s-.7-.7-.96-.7h-.82a1.6 1.6 0 0 0-1.18.56 4.93 4.93 0 0 0-1.44 3.66c0 2.16 1.56 4.27 1.76 4.56s3.1 4.72 7.55 6.6a25.37 25.37 0 0 0 2.52.94 6 6 0 0 0 2.76.18c.84-.12 2.5-1 2.85-1.9s.35-1.7.25-1.88-.36-.28-.75-.48z" />
                      </svg>
                      <h3 className="font-bold text-sm">Selecciona una tienda</h3>
                    </div>
                    <button
                      onClick={() => setShowMenu(false)}
                      className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
                      aria-label="Cerrar"
                    >
                      <Close fontSize="small" />
                    </button>
                  </div>

                  {/* Lista tiendas */}
                  <div className="p-2 min-w-70 max-w-[320px]">
                    {TIENDAS.map((tienda) => (
                      <button
                        key={tienda.id}
                        onClick={() => handleWhatsAppClick(tienda.whatsapp, tienda.nombre)}
                        className="w-full text-left p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all flex items-start gap-3 group"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 shrink-0 group-hover:scale-110 transition-transform">
                          <FmdGood fontSize="small" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">{tienda.nombre}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{tienda.direccion}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Botón WhatsApp principal */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={[
                "bg-linear-to-br from-green-500 to-green-600 text-white p-4 rounded-full",
                "shadow-2xl transition-all hover:scale-110 active:scale-95 group relative",
                showMenu ? "ring-4 ring-green-400/50" : "",
              ].join(" ")}
              aria-label="Contactar por WhatsApp"
            >
              {!showMenu && <span className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping" />}
              <svg
                className="w-7 h-7 relative z-10 transition-transform group-hover:rotate-12"
                viewBox="0 0 32 32"
                fill="currentColor"
              >
                <path d="M16 0a16 16 0 0 0-13.84 24.08L0 32l8.16-2.16A16 16 0 1 0 16 0zm0 29.33a13.22 13.22 0 0 1-6.72-1.8l-.48-.28-4.84 1.28 1.3-4.78-.32-.5A13.27 13.27 0 1 1 16 29.33zm7.38-9.38c-.4-.2-2.36-1.17-2.73-1.3s-.63-.2-.9.2-1.04 1.3-1.28 1.56-.48.3-.84.1a10.94 10.94 0 0 1-3.36-2.06 12.7 12.7 0 0 1-2.36-3.02c-.24-.4 0-.62.18-.84s.42-.52.63-.8c.2-.28.26-.46.38-.76s.06-.58 0-.8c-.1-.24-.94-2.4-1.3-3.3s-.7-.7-.96-.7h-.82a1.6 1.6 0 0 0-1.18.56 4.93 4.93 0 0 0-1.44 3.66c0 2.16 1.56 4.27 1.76 4.56s3.1 4.72 7.55 6.6a25.37 25.37 0 0 0 2.52.94 6 6 0 0 0 2.76.18c.84-.12 2.5-1 2.85-1.9s.35-1.7.25-1.88-.36-.28-.75-.48z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                3
              </span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
