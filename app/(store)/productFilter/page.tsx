// "use client";
// import ProductFilterPanel from "@/components/ProductFilterSidebar/ProductFilterPanel";

// export default function ProductFilter() {
//   return <ProductFilterPanel />;
// }

"use client";

import { ProductFilterSidebar } from "@/components/ProductFilterSidebar";
import { ProductGrid, PRODUCTS, ProductToolbar } from "@/components/product";

export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">

      <div className="max-w-400 mx-auto flex">

        <ProductFilterSidebar />

        <main className="flex-1 min-w-0">

          <div className="max-w-7xl mx-auto p-6">

            <ProductToolbar
              total={PRODUCTS.length}
            />

            <ProductGrid
              products={PRODUCTS}
            />
          </div>
        </main>
      </div>
    </div>
  );
}