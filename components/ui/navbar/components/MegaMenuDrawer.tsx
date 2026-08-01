"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { MENU_CATEGORIES } from "../navbar.mock";

interface MegaMenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MegaMenuDrawer({ open, onClose }: MegaMenuDrawerProps) {
  const [activeId, setActiveId] = useState(MENU_CATEGORIES[0].id);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const active = MENU_CATEGORIES.find((c) => c.id === activeId) ?? MENU_CATEGORIES[0];

  return (
    <div className="fixed inset-0 z-50 hidden md:block">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute left-0 top-0 flex h-full w-full max-w-4xl flex-col bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-base px-6 py-4">
          <h2 className="text-lg font-bold text-text-primary">Menú de categorías</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-surface-secondary"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Columna de categorías */}
          <nav className="w-64 shrink-0 overflow-y-auto border-r border-border-base bg-surface-secondary py-2">
            {MENU_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onMouseEnter={() => setActiveId(category.id)}
                onClick={() => setActiveId(category.id)}
                className={`flex w-full items-center justify-between px-5 py-3 text-left text-sm font-medium transition-colors ${
                  activeId === category.id
                    ? "bg-surface text-orange-600 border-l-4 border-orange-500"
                    : "text-text-primary border-l-4 border-transparent hover:bg-surface"
                }`}
              >
                <span className="flex items-center gap-2">
                  {category.label}
                  {category.badge && (
                    <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-600">
                      {category.badge}
                    </span>
                  )}
                </span>
                <ChevronRightIcon fontSize="small" className="opacity-40" />
              </button>
            ))}
          </nav>

          {/* Panel de subcategorías */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-text-primary">{active.label}</h3>
              <Link
                href={active.href}
                onClick={onClose}
                className="text-sm font-semibold text-orange-600 hover:underline"
              >
                Ver todo
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
              {active.groups.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 text-sm font-semibold text-text-primary">{group.title}</p>
                  <ul className="space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item}>
                        <Link
                          href={`${active.href}&item=${encodeURIComponent(item)}`}
                          onClick={onClose}
                          className="text-sm text-text-secondary hover:text-orange-600"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {group.seeAllHref && (
                    <Link
                      href={group.seeAllHref}
                      onClick={onClose}
                      className="mt-2 inline-block text-xs font-semibold text-orange-600 hover:underline"
                    >
                      Ver todo
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
