"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import EmailIcon from "@mui/icons-material/Email";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import type { SvgIconComponent } from "@mui/icons-material";
import { PRODUCT_ITEMS } from "../navbar.config";

interface NavMobileProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  activeNav: string;
  onNavClick: (id: string) => void;
  onLogin: () => void;
  onLogout: () => void;
}

export function NavMobile({
  isOpen,
  isLoggedIn,
  activeNav,
  onNavClick,
  onLogin,
  onLogout,
}: NavMobileProps) {
  const [expanded, setExpanded] = useState<string | null>("products");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const updateSearchParams = useCallback((search: string) => {
    const params = new URLSearchParams(window.location.search);
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    const query = params.toString();
    router.replace(`/productFilter${query ? `?${query}` : ""}`);
  }, [router]);

  useEffect(() => {
    const trimmed = searchTerm.trim();
    const timeoutId = window.setTimeout(() => {
      if (trimmed) {
        updateSearchParams(trimmed);
      } else if (window.location.pathname === "/productFilter") {
        updateSearchParams("");
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm, updateSearchParams]);

  function toggle(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  function handleSearch() {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    updateSearchParams(trimmed);
  }

  const activeCls =
    "border-blue-500/20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/15";

  const defaultCls =
    "border-slate-200 bg-white/90 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-blue-900 dark:hover:bg-blue-950/40 dark:hover:text-blue-300";

  return (
    <div
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-white/60 dark:border-white/10 ${
        isOpen ? "max-h-175 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="max-h-[calc(100vh-4.5rem)] overflow-y-auto overscroll-contain px-3 py-3 space-y-3 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]">
        <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm dark:border-white/10 dark:from-white/5 dark:to-transparent">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Navegación
              </p>
              <h2 className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                Compra más rápido desde tu móvil
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Catálogo, cuenta y contacto en un solo panel.
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
              <WorkOutlineOutlinedIcon fontSize="small" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 h-12 rounded-2xl border border-slate-200 bg-slate-50/90 dark:border-white/10 dark:bg-white/5">
          <SearchIcon
            style={{ fontSize: 16 }}
            className="text-slate-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleSearch()}
            placeholder="Buscar..."
            className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none w-full"
          />
        </div>

        {/* Home */}
        <Link
          href="/"
          onClick={() => onNavClick("Inicio")}
          className={`flex h-12 w-full items-center gap-3 rounded-2xl border px-4 text-sm font-medium transition-all duration-150 ${
            activeNav === "Inicio" ? activeCls : defaultCls
          }`}
        >
          <HomeOutlinedIcon
            fontSize="small"
            className="opacity-75"
          />

          <span className="min-w-0 truncate">Inicio</span>
        </Link>

        <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
          <MobileCollapsible
            id="products"
            label="Categorías"
            icon={
              <WorkOutlineOutlinedIcon
                fontSize="small"
                className="opacity-70"
              />
            }
            expanded={expanded}
            onToggle={toggle}
            items={PRODUCT_ITEMS}
          />
        </section>

        <Link
          href="/productFilter"
          onClick={() => onNavClick("productFilter")}
          className={`flex h-12 w-full items-center gap-3 rounded-2xl border px-4 text-sm font-medium transition-all duration-150 ${
            activeNav === "productFilter" ? activeCls : defaultCls
          }`}
        >
          <BusinessOutlinedIcon fontSize="small" className="opacity-75" />

          <span className="min-w-0 truncate">Catálogo</span>
        </Link>

        <Link
          href="/#contacto"
          onClick={() => onNavClick("contacto")}
          className={`flex h-12 w-full items-center gap-3 rounded-2xl border px-4 text-sm font-medium transition-all duration-150 ${
            activeNav === "contacto" ? activeCls : defaultCls
          }`}
        >
          <EmailIcon fontSize="small" className="opacity-75" />

          <span className="min-w-0 truncate">Contáctenos</span>
        </Link>

        {/* Auth mobile */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Acceso
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {isLoggedIn ? "Gestiona tu perfil" : "Ingresa para ver tus pedidos"}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300">
              <PersonOutlineOutlinedIcon fontSize="small" />
            </div>
          </div>

          {isLoggedIn ? (
            <div className="space-y-2">
              <Link
                href="/perfil"
                className="flex h-12 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/90 px-4 text-sm font-medium text-slate-700 transition-all duration-150 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-blue-900 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
              >
                <PersonOutlineOutlinedIcon
                  fontSize="small"
                  className="opacity-75"
                />

                Mi Perfil
              </Link>

              <Link
                href="/configuracion"
                className="flex h-12 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/90 px-4 text-sm font-medium text-slate-700 transition-all duration-150 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-blue-900 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
              >
                <SettingsOutlinedIcon
                  fontSize="small"
                  className="opacity-75"
                />

                Configuración
              </Link>

              <button
                onClick={onLogout}
                className="flex h-12 w-full items-center gap-3 rounded-2xl border border-red-200/70 bg-red-50/80 px-4 text-sm font-medium text-red-600 transition-all duration-150 hover:bg-red-50 dark:border-red-500/20 dark:bg-red-950/20 dark:text-red-300"
              >
                <LogoutOutlinedIcon
                  fontSize="small"
                  className="opacity-75"
                />

                Salir
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={onLogin}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-cyan-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5"
              >
                <LoginOutlinedIcon fontSize="small" />

                Acceso
              </button>

              <Link
                href="/login-usuario"
                className="flex h-11 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-all duration-150 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-blue-900 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
              >
                Acceso alterno
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MobileCollapsible ─────────────────────────────────────────────

interface MobileCollapsibleProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  expanded: string | null;
  onToggle: (id: string) => void;
  items: ReadonlyArray<{
    icon: SvgIconComponent;
    label: string;
    href: string;
  }>;
}

function MobileCollapsible({
  id,
  label,
  icon,
  expanded,
  onToggle,
  items,
}: MobileCollapsibleProps) {
  const isOpen = expanded === id;

  return (
    <div>
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5 transition-all duration-150"
      >
        <div className="flex items-center gap-3">
          {icon}
          {label}
        </div>

        <KeyboardArrowDownIcon
          fontSize="small"
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 pl-4 ${
          isOpen ? "max-h-72 mt-2" : "max-h-0"
        }`}
      >
        {items.map(({ icon: Icon, label: itemLabel, href }) => (
          <Link
            key={itemLabel}
            href={href}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white transition-all duration-150"
          >
            <span className="opacity-60">
              <Icon fontSize="small" />
            </span>

            {itemLabel}
          </Link>
        ))}
      </div>
    </div>
  );
}