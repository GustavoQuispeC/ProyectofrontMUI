import FilterSection from "../FilterSection";

export default function PriceFilter() {
  return (
    <FilterSection title="Precio">
      <div className="space-y-4">
        <input type="range" min={0} max={5000} className="w-full" />

        <div className="flex justify-between text-xs text-slate-500">
          <span>S/ 0</span>
          <span>S/ 3000</span>
        </div>
      </div>
    </FilterSection>
  );
}
