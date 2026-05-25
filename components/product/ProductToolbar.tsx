interface Props {
  total: number;
  sortBy: string;
  onSortChange: (value: string) => void;
  onOpenFilters?: () => void;
}

const SORT_OPTIONS = ["Destacados", "Precio menor", "Precio mayor", "Mejor valorados"];

export default function ProductToolbar({ total, sortBy, onSortChange, onOpenFilters }: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => (typeof (onOpenFilters) === "function" ? onOpenFilters() : null)}
          className="md:hidden inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        >
          Filtros
        </button>
        <p className="text-sm text-slate-500">{total} productos</p>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-500">
        <span className="whitespace-nowrap">Ordenar por:</span>
        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}