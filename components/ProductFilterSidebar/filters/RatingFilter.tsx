import FilterSection from "../FilterSection";
import { RATINGS } from "../constants";

export default function RatingFilter() {
  return (
    <FilterSection title="Valoración">

      <div className="space-y-3">
        {RATINGS.map((rating) => (
          <label
            key={rating}
            className="flex items-center gap-2 text-sm"
          >
            <input type="checkbox" />

            {"★".repeat(rating)}
          </label>
        ))}
      </div>
    </FilterSection>
  );
}