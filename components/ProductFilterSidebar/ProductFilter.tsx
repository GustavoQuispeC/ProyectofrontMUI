// "use client";

// import { useMemo, useState } from "react";

// import ProductCard from "./ProductCard";
// import ProductFilterPanel from "./ProductFilterPanel";
// import EmptyState from "./EmptyState";
// import Chip from "./Chip";

// import {
//   Product,
//   ProductColor,
//   ProductSize,
// } from "./types";

// const PRODUCTS: Product[] = [
//   {
//     id: 1,
//     name: "Nike Hoodie",
//     brand: "Nike",
//     size: "M",
//     color: "Black",
//     price: 80,
//     image: null,
//   },
// ];

// export default function ProductFilter() {
//   const [selectedBrands, setSelectedBrands] =
//     useState<string[]>([]);

//   const [selectedSizes, setSelectedSizes] =
//     useState<ProductSize[]>([]);

//   const [selectedColors, setSelectedColors] =
//     useState<ProductColor[]>([]);

//   const [searchTerm, setSearchTerm] =
//     useState("");

//   const activeCount =
//     selectedBrands.length +
//     selectedSizes.length +
//     selectedColors.length;

//   const handleClearAll = () => {
//     setSelectedBrands([]);
//     setSelectedSizes([]);
//     setSelectedColors([]);
//     setSearchTerm("");
//   };

//   const filteredProducts = useMemo(() => {
//     return PRODUCTS.filter((p) =>
//       p.name
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     );
//   }, [searchTerm]);

//   return (
//     <div className="flex min-h-screen">
//       <aside className="w-72 border-r">
//         <ProductFilterPanel
//           activeCount={activeCount}
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           selectedBrands={selectedBrands}
//           setSelectedBrands={
//             setSelectedBrands
//           }
//           selectedSizes={selectedSizes}
//           setSelectedSizes={setSelectedSizes}
//           selectedColors={selectedColors}
//           setSelectedColors={
//             setSelectedColors
//           }
//           handleClearAll={handleClearAll}
//         />
//       </aside>

//       <main className="flex-1 p-6">
//         <div className="flex gap-2 mb-4">
//           {selectedBrands.map((brand) => (
//             <Chip
//               key={brand}
//               label={brand}
//               onRemove={() =>
//                 setSelectedBrands((prev) =>
//                   prev.filter(
//                     (b) => b !== brand
//                   )
//                 )
//               }
//             />
//           ))}
//         </div>

//         {filteredProducts.length === 0 ? (
//           <EmptyState
//             onClear={handleClearAll}
//           />
//         ) : (
//           <div className="grid grid-cols-4 gap-4">
//             {filteredProducts.map((product) => (
//               <ProductCard
//                 key={product.id}
//                 product={product}
//               />
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

