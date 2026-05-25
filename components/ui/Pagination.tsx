interface Props {
  page: number; // 1-based
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-1 rounded-xl border bg-white dark:bg-neutral-900 border-slate-200 disabled:opacity-50"
      >
        Anterior
      </button>

      {start > 1 && (
        <button
          type="button"
          onClick={() => onChange(1)}
          className="px-3 py-1 rounded-xl border bg-white dark:bg-neutral-900 border-slate-200"
        >
          1
        </button>
      )}

      {start > 2 && <span className="px-2">…</span>}

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`px-3 py-1 rounded-xl border border-slate-200 ${p === page ? "bg-blue-600 text-white" : "bg-white dark:bg-neutral-900"}`}
        >
          {p}
        </button>
      ))}

      {end < totalPages - 1 && <span className="px-2">…</span>}

      {end < totalPages && (
        <button
          type="button"
          onClick={() => onChange(totalPages)}
          className="px-3 py-1 rounded-xl border bg-white dark:bg-neutral-900 border-slate-200"
        >
          {totalPages}
        </button>
      )}

      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-3 py-1 rounded-xl border bg-white dark:bg-neutral-900 border-slate-200 disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}
