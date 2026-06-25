"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { NavDesktop } from "./components/NavDesktop";
import { NavMobile } from "./components/NavMobile";
import { NavActions } from "./components/NavActions";
import type { DropdownId } from "./types";
import Image from "next/image";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Inicio");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ← conectar con auth real
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Shadow on scroll
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar dropdowns al click fuera
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Cerrar mobile menu en resize a desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function toggleDropdown(id: DropdownId) {
    setOpenDropdown((prev) => (prev === id ? null : id));
  }

  function handleNavClick(id: string) {
    setActiveNav(id);
    setOpenDropdown(null);
    setMobileOpen(false);
  }

  function handleLogin() {
    setIsLoggedIn(true);
    setMobileOpen(false);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setOpenDropdown(null);
  }

  return (
    <div ref={navRef} className="sticky top-0 z-40">
      <nav
        className={`relative overflow-visible border-b border-white/60 bg-white/88 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-zinc-950/80 ${
          scrolled
            ? "shadow-[0_18px_45px_-26px_rgba(15,23,42,0.55)]"
            : "shadow-none"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-500/35 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-2">
            <Link href="/" className="flex items-center gap-3 shrink-0 group mr-2">
              <Image
                src="/Logo1Famet.png"
                alt="Grupo Famet"
                width={96}
                height={16}
                priority
                className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </Link>

            {/* Desktop links */}
            <NavDesktop
              activeNav={activeNav}
              openDropdown={openDropdown}
              onNavClick={handleNavClick}
              onToggleDropdown={toggleDropdown}
            />

            {/* Right actions: search, theme, notifs, auth */}
            <NavActions
              isLoggedIn={isLoggedIn}
              openDropdown={openDropdown}
              onToggleDropdown={toggleDropdown}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />

            {/* Mobile hamburger */}
            <button
              className="md:hidden ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-base bg-surface/90 text-text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-blue-900 dark:hover:bg-blue-950/70 dark:hover:text-blue-300"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <NavMobile
          isOpen={mobileOpen}
          isLoggedIn={isLoggedIn}
          activeNav={activeNav}
          onNavClick={handleNavClick}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </nav>
    </div>
  );
}
