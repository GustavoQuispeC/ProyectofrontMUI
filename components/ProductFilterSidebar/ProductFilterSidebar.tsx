import BrandFilter from "./filters/BrandFilter";
import CategoryFilter from "./filters/CategoryFilter";
import OfferFilter from "./filters/OfferFilter";
import PriceFilter from "./filters/PriceFilter";
import RatingFilter from "./filters/RatingFilter";

export default function ProductFilterSidebar() {
  return (
    <aside className="hidden md:block w-72 xl:w-80 shrink-0 border-r border-slate-200 dark:border-neutral-800 min-h-screen sticky top-0">

      <div className="p-6">

        <h2 className="text-lg font-bold mb-6">
          Filtros
        </h2>

        <div className="space-y-2">

          <CategoryFilter />

          <BrandFilter />

          <OfferFilter />

          <RatingFilter />

          <PriceFilter />
        </div>
      </div>
    </aside>
  );
}