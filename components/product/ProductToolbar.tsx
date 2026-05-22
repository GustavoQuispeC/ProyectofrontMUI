interface Props {
  total: number;
}

export default function ProductToolbar({ total }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">

      <p className="text-sm text-slate-500">
        {total} productos
      </p>

      <select className="px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm">
        <option>Destacados</option>
        <option>Precio menor</option>
        <option>Precio mayor</option>
        <option>Mejor valorados</option>
      </select>
    </div>
  );
}