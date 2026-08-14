"use client";
import Image from "next/image";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { CartButton } from "@/components/cartdrawer/Cartdrawer";
import { SearchBox } from "./SearchBox";
import { Dropdown, DropdownItem } from "./Dropdown";
import type { DropdownId } from "../types";

interface TopBarProps {
  isLoggedIn: boolean;
  userName?: string | null;
  openDropdown: DropdownId;
  onToggleDropdown: (id: DropdownId) => void;
  onOpenMenu: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

export function TopBar({
  isLoggedIn,
  userName,
  openDropdown,
  onToggleDropdown,
  onOpenMenu,
  onLogin,
  onLogout,
}: TopBarProps) {
  return (
    <div className="bg-slate-950 border-b border-white/10 shadow-sm">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-y-2 py-2.5 md:h-16 md:flex-nowrap md:py-0">
          {/* Logo */}
          <Link href="/" className="mr-2 flex shrink-0 items-center">
            <Image
              src="/LogoFamet2.png"
              alt="Grupo Famet"
              width={96}
              height={12}
              priority
              className="h-10 w-auto object-contain md:h-12 brightness-110  drop-shadow-md"
            />
          </Link>

          {/* Botón Menú */}
          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 md:px-3"
          >
            <MenuIcon fontSize="medium" />
            <span className="hidden sm:inline">Menú</span>
          </button>

          {/* Enviar a */}
          {/* <button
            type="button"
            className="hidden items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 lg:inline-flex"
          >
            <RoomOutlinedIcon fontSize="small" />
            <span className="text-left leading-tight">
              Enviar a
              <br />
              <span className="font-semibold text-white">Lima</span>
            </span>
          </button> */}

          {/* Buscador */}
          <div className="order-last w-full md:order-0 md:mx-3 md:w-auto md:flex-1">
            <SearchBox />
          </div>

          {/* Acciones derecha */}
          <div className="ml-auto flex items-center gap-1">
            <CartButton />

            <Dropdown
              id="user"
              openId={openDropdown}
              onToggle={onToggleDropdown}
              align="right"
              width="w-60"
              triggerClassName="hover:bg-white/10"
              trigger={
                <span className="flex items-center gap-1">
                  <PersonOutlineOutlinedIcon fontSize="small" className="text-slate-300" />
                  <span className="hidden text-left leading-tight sm:block">
                    <span className="block text-[11px] text-slate-400">¡Hola!</span>
                    <span className="block font-semibold text-white">
                      {isLoggedIn ? (userName ?? "Mi cuenta") : "Inicia sesión"}
                    </span>
                  </span>
                  <KeyboardArrowDownIcon
                    fontSize="small"
                    className={`text-slate-300 transition-transform duration-200 ${
                      openDropdown === "user" ? "rotate-180" : ""
                    }`}
                  />
                </span>
              }
            >
              {isLoggedIn ? (
                <>
                  <DropdownItem
                    icon={<PersonOutlineOutlinedIcon fontSize="small" />}
                    label="Mi Perfil"
                    href="/perfil"
                  />
                  <DropdownItem
                    icon={<SettingsOutlinedIcon fontSize="small" />}
                    label="Configuración"
                    href="/configuracion"
                  />
                  <div className="my-1 border-t border-slate-200/10" />
                  <DropdownItem
                    icon={<LogoutOutlinedIcon fontSize="small" />}
                    label="Salir"
                    danger
                    onClick={onLogout}
                  />
                </>
              ) : (
                <>
                  <DropdownItem
                    icon={<LoginOutlinedIcon fontSize="small" />}
                    label="Iniciar sesión - Cliente"
                    onClick={onLogin}
                  />
                  <DropdownItem
                    icon={<PersonOutlineOutlinedIcon fontSize="small" />}
                    label="Acceso interno"
                    href="/login-usuario"
                  />
                </>
              )}
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}
