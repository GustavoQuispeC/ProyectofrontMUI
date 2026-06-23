"use client";

import { useEffect, useState } from "react";
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
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const updateSearchParams = (search: string) => {
    const params = new URLSearchParams(window.location.search);
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    const query = params.toString();
    router.replace(`/productFilter${query ? `?${query}` : ""}`);
  };

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
  }, [searchTerm, router]);

  function toggle(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  function handleSearch() {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    updateSearchParams(trimmed);
  }

  const activeCls =
    "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400";

  const defaultCls =
    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <div
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100 dark:border-gray-800 ${
        isOpen ? "max-h-175 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="px-3 py-3 space-y-0.5 bg-white dark:bg-gray-950">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-2">
          <SearchIcon
            style={{ fontSize: 16 }}
            className="text-gray-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleSearch()}
            placeholder="Buscar..."
            className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none w-full"
          />
        </div>

        {/* Home */}
        <Link
          href="/"
          onClick={() => onNavClick("Inicio")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-100 ${
            activeNav === "Inicio" ? activeCls : defaultCls
          }`}
        >
          <HomeOutlinedIcon
            fontSize="small"
            className="opacity-60"
          />

          Inicio
        </Link>

        {/* Productos collapsible */}
        <MobileCollapsible
          id="products"
          label="Ver por categorias"
          icon={
            <WorkOutlineOutlinedIcon
              fontSize="small"
              className="opacity-60"
            />
          }
          expanded={expanded}
          onToggle={toggle}
          items={PRODUCT_ITEMS}
        />

        {/* Catálogo productos */}
        <Link
          href="/productFilter"
          onClick={() => onNavClick("productFilter")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-100 ${
            activeNav === "productFilter" ? activeCls : defaultCls
          }`}
        >
          <BusinessOutlinedIcon
            fontSize="small"
            className="opacity-60"
          />

          Catálogo de productos
        </Link>

        {/* Contact */}
<Link
  href="/#contacto"
  onClick={() => onNavClick("contacto")}
  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-100 ${
    activeNav === "contacto" ? activeCls : defaultCls
  }`}
>
  <EmailIcon fontSize="small" className="opacity-60" />

  Contáctenos
</Link>

        {/* Auth mobile */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-2 mt-2 space-y-0.5">
          {isLoggedIn ? (
            <>
              <Link
                href="/perfil"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${defaultCls} transition-colors duration-100`}
              >
                <PersonOutlineOutlinedIcon
                  fontSize="small"
                  className="opacity-60"
                />

                Mi Perfil
              </Link>

              <Link
                href="/configuracion"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${defaultCls} transition-colors duration-100`}
              >
                <SettingsOutlinedIcon
                  fontSize="small"
                  className="opacity-60"
                />

                Configuración
              </Link>

              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors duration-100"
              >
                <LogoutOutlinedIcon
                  fontSize="small"
                  className="opacity-60"
                />

                Salir
              </button>
            </>
          ) : (
            <button
              onClick={onLogin}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-150"
            >
              <LoginOutlinedIcon fontSize="small" />

              Iniciar sesión
            </button>
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
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100"
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
          isOpen ? "max-h-48 mt-0.5" : "max-h-0"
        }`}
      >
        {items.map(({ icon: Icon, label: itemLabel, href }) => (
          <Link
            key={itemLabel}
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-100"
          >
            <span className="opacity-50">
              <Icon fontSize="small" />
            </span>

            {itemLabel}
          </Link>
        ))}
      </div>
    </div>
  );
}