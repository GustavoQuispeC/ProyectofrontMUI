// components/Dropdown.tsx
import type { DropdownId } from "../types";

// ─── Dropdown ────────────────────────────────────────────────────────────────

interface DropdownProps {
  id: DropdownId;
  openId: DropdownId;
  onToggle: (id: DropdownId) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  width?: string;
}

export function Dropdown({
  id,
  openId,
  onToggle,
  trigger,
  children,
  align = "left",
  width = "w-52",
}: DropdownProps) {
  const isOpen = openId === id;
  return (
    <div className="relative">
      <button
        onClick={() => onToggle(id)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap ${
          isOpen
            ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        }`}
      >
        {trigger}
      </button>
      <div
        className={`absolute top-full mt-1.5 ${width} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-1.5 z-50 transition-all duration-150 origin-top ${
          align === "right" ? "right-0" : "left-0"
        } ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

// ─── DropdownItem ─────────────────────────────────────────────────────────────

import Link from "next/link";

interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  badge?: string;
  danger?: boolean;
  onClick?: () => void;
}

export function DropdownItem({
  icon,
  label,
  href,
  badge,
  danger,
  onClick,
}: DropdownItemProps) {
  const className = `
    flex items-center gap-2.5
    rounded-lg px-3 py-2
    text-sm
    transition-colors duration-100
    ${
      danger
        ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
    }
  `;

  // ─── Si tiene href → navegación ─────────────────────────────
  if (href) {
    return (
      <Link href={href} className={className}>
        <span className="shrink-0 opacity-60">{icon}</span>

        <span className="flex-1">{label}</span>

        {badge && (
          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold leading-tight text-white">
            {badge}
          </span>
        )}
      </Link>
    );
  }

  // ─── Si NO tiene href → acción ─────────────────────────────
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} w-full text-left`}
    >
      <span className="shrink-0 opacity-60">{icon}</span>

      <span className="flex-1">{label}</span>

      {badge && (
        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold leading-tight text-white">
          {badge}
        </span>
      )}
    </button>
  );
}