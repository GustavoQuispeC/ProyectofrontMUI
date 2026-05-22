interface Props {
  onClear: () => void;
}

export default function EmptyState({ onClear }: Props) {
  return (
    <div className="py-20 flex flex-col items-center text-center">

      <p className="text-lg font-semibold">
        No se encontraron productos
      </p>

      <button
        onClick={onClear}
        className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white"
      >
        Limpiar filtros
      </button>
    </div>
  );
}