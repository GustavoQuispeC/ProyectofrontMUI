import Link from "next/link";
import { useEffect, useRef } from "react";
import type { DropdownId } from "../types";

interface DropdownProps {
  id: DropdownId;
  openId: DropdownId;
  onToggle: (id: DropdownId) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  width?: string;
  triggerClassName?: string;
}

export function Dropdown({
  id,
  openId,
  onToggle,
  trigger,
  children,
  align = "left",
  width = "w-52",
  triggerClassName = "",
}: DropdownProps) {
  const isOpen = openId === id;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        onToggle(id);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen, id, onToggle]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className={`inline-flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-slate-900 transition-colors duration-150 whitespace-nowrap ${triggerClassName}`}
      >
        {trigger}
      </button>
      <div
        className={`absolute top-full mt-2 ${width} rounded-xl border border-border-base bg-surface p-2 shadow-2xl z-50 transition-all duration-200 origin-top ${
          align === "right" ? "right-0" : "left-0"
        } ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}
      >
        {children}
      </div>
    </div>
  );
}

interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  badge?: string;
  danger?: boolean;
  onClick?: () => void;
}

export function DropdownItem({ icon, label, href, badge, danger, onClick }: DropdownItemProps) {
  const className = `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 ${
    danger ? "text-red-600 hover:bg-red-50" : "text-text-primary hover:bg-surface-secondary"
  }`;

  const content = (
    <>
      <span className="shrink-0 text-text-secondary">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-semibold leading-tight text-white">
          {badge}
        </span>
      )}
    </>
  );

  if (href)
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  return (
    <button type="button" onClick={onClick} className={`${className} w-full text-left`}>
      {content}
    </button>
  );
}
