interface EmptyStateProps {
  onClear: () => void;
}

export default function EmptyState({
  onClear,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <p className="text-sm font-semibold">
        No products found
      </p>

      <button
        type="button"
        onClick={onClear}
        className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white"
      >
        Clear all filters
      </button>
    </div>
  );
}