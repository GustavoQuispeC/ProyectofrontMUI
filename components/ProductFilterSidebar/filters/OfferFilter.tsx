import FilterSection from "../FilterSection";
import { OFFERS } from "../constants";

export default function OfferFilter() {
  return (
    <FilterSection title="Ofertas">

      <div className="space-y-3">
        {OFFERS.map((offer) => (
          <label
            key={offer}
            className="flex items-center gap-2 text-sm"
          >
            <input type="checkbox" />

            {offer}
          </label>
        ))}
      </div>
    </FilterSection>
  );
}