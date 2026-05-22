import FilterSection from "../FilterSection";
import { CATEGORIES } from "../constants";

export default function CategoryFilter() {
  return (
    <FilterSection title="Categorías">

      <div className="space-y-3">
        {CATEGORIES.map((category) => (
          <label
            key={category}
            className="flex items-center gap-2 text-sm"
          >
            <input type="checkbox" />

            {category}
          </label>
        ))}
      </div>
    </FilterSection>
  );
}