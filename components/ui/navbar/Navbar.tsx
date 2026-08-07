"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { TopBar } from "./components/TopBar";
import { MegaMenuDrawer } from "./components/MegaMenuDrawer";
import { MobileDrawer } from "./components/MobileDrawer";
import type { DropdownId } from "./types";

const HIDE_ON_SCROLL_ROUTES = ["/productFilter"];
const SCROLL_HIDE_THRESHOLD = 80;

export default function Navbar() {
  const pathname = usePathname();
  const shouldHideOnScroll = HIDE_ON_SCROLL_ROUTES.some((route) => pathname?.startsWith(route));

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!shouldHideOnScroll) return;

    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY <= SCROLL_HIDE_THRESHOLD) {
        setHidden(false);
      } else if (delta > 4) {
        setHidden(true);
      } else if (delta < -4) {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldHideOnScroll]);

  function toggleDropdown(id: DropdownId) {
    setOpenDropdown((prev) => (prev === id ? null : id));
  }

  function handleLogin() {
    setIsLoggedIn(true);
    setOpenDropdown(null);
    setMenuOpen(false);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setOpenDropdown(null);
  }

  const isHidden = shouldHideOnScroll && hidden;

  return (
    <>
      <div
        className={`sticky top-0 z-40 transition-transform duration-300 ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <TopBar
          isLoggedIn={isLoggedIn}
          userName="Admin"
          openDropdown={openDropdown}
          onToggleDropdown={toggleDropdown}
          onOpenMenu={() => setMenuOpen(true)}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </div>

      <MegaMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <MobileDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isLoggedIn={isLoggedIn}
        userName="Admin"
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </>
  );
}
