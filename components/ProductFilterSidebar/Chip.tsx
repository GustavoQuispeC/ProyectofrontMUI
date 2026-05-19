interface ChipProps {
  label: string;
  onRemove: () => void;
}

export default function Chip({
  label,
  onRemove,
}: ChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-neutral-700">
      {label}

      <button
        type="button"
        onClick={onRemove}
        className="w-3.5 h-3.5 flex items-center justify-center rounded-full"
      >
        ✕
      </button>
    </span>
  );
}