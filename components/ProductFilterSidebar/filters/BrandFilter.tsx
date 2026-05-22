import FilterSection from "../FilterSection";
import { BRANDS } from "../constants";

export default function BrandFilter() {
  return (
    <FilterSection title="Marcas">

      <div className="space-y-3">
        {BRANDS.map((brand) => (
          <label
            key={brand}
            className="flex items-center gap-2 text-sm"
          >
            <input type="checkbox" />

            {brand}
          </label>
        ))}
      </div>
    </FilterSection>
  );
}