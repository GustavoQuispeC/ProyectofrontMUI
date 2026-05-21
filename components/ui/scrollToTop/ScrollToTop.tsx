"use client";
import { ArrowUpward } from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [showBackToTop, setShowBackToTop] = useState(false);

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

  return (
   
      <main className="grow">

        {/* CONTROLES FLOTANTES */}
        <div className="fixed bottom-25 right-6 z-50 flex flex-col items-end gap-4">
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
        </div>
      </main>

      
   
  );
}
