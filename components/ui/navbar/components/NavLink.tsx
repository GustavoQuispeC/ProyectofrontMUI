// components/NavLink.tsx

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  active?: boolean;
  onClick?: () => void;
}

export function NavLink({ icon, label, badge, active, onClick }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap ${
        active
          ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
      }`}
    >
      <span className="opacity-70">{icon}</span>
      {label}
      {badge && (
        <span className="ml-1 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full leading-tight">
          {badge}
        </span>
      )}
    </button>
  );
}