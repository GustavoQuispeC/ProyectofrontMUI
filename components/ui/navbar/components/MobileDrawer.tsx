"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useCategoriasPublicas } from "@/features/dashboard/categoria/hooks/useCategorias";
import { MegaMenuCategory } from "../types";
import { SearchBox } from "./SearchBox";

function buildMenuCategories(categorias: { id: number; nombre: string }[]): MegaMenuCategory[] {
  return categorias.map((c) => ({
    id: String(c.id),
    label: c.nombre,
    href: `/productFilter?category=${encodeURIComponent(c.nombre)}`,
    groups: [
      {
        title: "Ver todo",
        seeAllHref: `/productFilter?category=${encodeURIComponent(c.nombre)}`,
        items: [],
      },
    ],
  }));
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  userName?: string | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function MobileDrawer({ open, onClose, isLoggedIn, userName, onLogin, onLogout }: MobileDrawerProps) {
  const { categorias, loading } = useCategoriasPublicas();
  const menuCategories = useMemo(() => buildMenuCategories(categorias), [categorias]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleClose = () => {
    setActiveId(null);
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const active = menuCategories.find((c) => c.id === activeId);

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="absolute left-0 top-0 flex h-full w-[88vw] max-w-sm flex-col bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-base px-4 py-4">
          <p className="text-base font-bold text-text-primary">
            {isLoggedIn ? `¡Hola, ${userName ?? "usuario"}!` : "¡Hola!"}
          </p>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar menú"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-surface-secondary"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Búsqueda */}
        <div className="border-b border-border-base px-4 py-3">
          <SearchBox onNavigate={handleClose} />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {!active ? (
            <nav className="py-2">
              <Link
                href="/"
                onClick={handleClose}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-primary hover:bg-surface-secondary"
              >
                <HomeOutlinedIcon fontSize="small" className="opacity-70" />
                Inicio
              </Link>

              {menuCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveId(category.id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-text-primary hover:bg-surface-secondary"
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

              <Link
                href="/productFilter"
                onClick={handleClose}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-primary hover:bg-surface-secondary"
              >
                Catálogo completo
              </Link>

              <Link
                href="/#contacto"
                onClick={handleClose}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-primary hover:bg-surface-secondary"
              >
                Contáctenos
              </Link>
            </nav>
          ) : (
            <div className="py-2">
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-text-primary hover:bg-surface-secondary"
              >
                <ArrowBackIcon fontSize="small" />
                {active.label}
              </button>

              <Link
                href={active.href}
                onClick={handleClose}
                className="mx-4 mb-2 block rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600"
              >
                Ver todo en {active.label}
              </Link>

              {active.groups.map((group) => (
                <div key={group.title} className="px-4 py-2">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    {group.title}
                  </p>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item}>
                        <Link
                          href={`${active.href}&item=${encodeURIComponent(item)}`}
                          onClick={handleClose}
                          className="block py-1.5 text-sm text-text-primary hover:text-orange-600"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer auth */}
        <div className="border-t border-border-base p-4">
          {isLoggedIn ? (
            <div className="space-y-2">
              <Link
                href="/perfil"
                onClick={handleClose}
                className="flex h-11 w-full items-center gap-3 rounded-xl border border-border-base px-4 text-sm font-medium text-text-primary hover:bg-surface-secondary"
              >
                <PersonOutlineOutlinedIcon fontSize="small" className="opacity-70" />
                Mi Perfil
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="flex h-11 w-full items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-600"
              >
                <LogoutOutlinedIcon fontSize="small" />
                Salir
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 text-sm font-semibold text-white shadow-lg hover:bg-orange-700"
            >
              <LoginOutlinedIcon fontSize="small" />
              Inicia sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
