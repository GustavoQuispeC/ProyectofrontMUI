// components/NavActions.tsx
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EmailIcon from "@mui/icons-material/Email";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dropdown, DropdownItem } from "./Dropdown";
import type { DropdownId } from "../types";
import { CartButton } from "@/components/cartdrawer/Cartdrawer";
import { useThemeMode } from "../../theme/ThemeRegistry";

interface NavActionsProps {
  isLoggedIn: boolean;
  openDropdown: DropdownId;
  onToggleDropdown: (id: DropdownId) => void;
  onLogin: () => void;
  onLogout: () => void;
}

export function NavActions({ isLoggedIn, openDropdown, onToggleDropdown, onLogin, onLogout }: NavActionsProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { mode, toggleTheme } = useThemeMode();
  const router = useRouter();

  const updateSearchParams = useCallback(
    (search: string) => {
      const params = new URLSearchParams(window.location.search);
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      const query = params.toString();
      router.replace(`/productFilter${query ? `?${query}` : ""}`);
    },
    [router],
  );

  useEffect(() => {
    const trimmed = searchTerm.trim();
    const timer = setTimeout(() => {
      if (trimmed) {
        updateSearchParams(trimmed);
      } else if (window.location.pathname === "/productFilter") {
        updateSearchParams("");
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, updateSearchParams]);

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    updateSearchParams(trimmed);
  };

  return (
    <div className="flex items-center gap-1 ml-auto">
      <CartButton />

      {/* Search */}
      <div
        className={`hidden md:flex items-center gap-2 px-3 h-8 rounded-lg border transition-all duration-200 ${
          searchFocused
            ? "border-blue-300 bg-background w-48"
            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 w-32"
        }`}
      >
        <SearchIcon fontSize="small" className="text-gray-500 shrink-0" style={{ fontSize: 16 }} />
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleSearch()}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none w-full"
        />
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={toggleTheme}
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
        aria-label="Toggle dark mode"
      >
        {mode === "dark" ? (
          <LightModeOutlinedIcon style={{ fontSize: 18 }} />
        ) : (
          <DarkModeOutlinedIcon style={{ fontSize: 18 }} />
        )}
      </button>

      {/* Notifications (solo logueado) */}
      {isLoggedIn && (
        <button className="relative w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-150">
          <NotificationsNoneOutlinedIcon style={{ fontSize: 18 }} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-950" />
        </button>
      )}

      <div className="hidden md:block w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

      {/* Auth */}
      {isLoggedIn ? (
        <Dropdown
          id="user"
          openId={openDropdown}
          onToggle={onToggleDropdown}
          align="right"
          width="w-60"
          trigger={
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                  GQ
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-gray-950" />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-[13px] font-medium text-gray-800 dark:text-gray-200 leading-tight">Gustavo</div>
                <div className="text-[11px] text-gray-400">Administrador</div>
              </div>
              <KeyboardArrowDownIcon
                fontSize="small"
                className={`hidden lg:block transition-transform duration-200 ${openDropdown === "user" ? "rotate-180" : ""}`}
              />
            </div>
          }
        >
          {/* Header del user */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-gray-100 dark:border-gray-800 mb-1">
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-semibold text-blue-700 dark:text-blue-300 shrink-0">
              G
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Gustavo</div>
              <div className="text-[11px] text-gray-400">gusstavocta@gmail.com</div>
            </div>
          </div>
          <DropdownItem icon={<PersonOutlineOutlinedIcon fontSize="small" />} label="Mis pedidos" />
          <DropdownItem icon={<SettingsOutlinedIcon fontSize="small" />} label="Deudas" />
          <DropdownItem icon={<EmailIcon fontSize="small" />} label="Mensajes" badge="3" />
          <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
          <DropdownItem icon={<LogoutOutlinedIcon fontSize="small" />} label="Salir" danger onClick={onLogout} />
        </Dropdown>
      ) : (
        <button
          onClick={onLogin}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-blue-500/20 bg-linear-to-r from-blue-600 to-cyan-600 px-4 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-500/30"
        >
          <LoginOutlinedIcon style={{ fontSize: 16 }} />
          Acceso
        </button>
      )}
    </div>
  );
}
