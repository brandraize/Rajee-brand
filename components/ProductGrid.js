// components/ProductGrid.js
"use client";

import BundleCard from "./BundleCard";

export default function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <BundleCard key={product.id} bundle={product} />
      ))}
    </div>
  );
}