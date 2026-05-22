"use client";

import ProductCard from "./ProductCard";
import products from "@/data/products";

export default function Bestsellers() {

  const bestsellerProducts = products.slice(0, 4);

  return (

    <section className="px-6 py-24 border-t border-white/10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">

          <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-5">

            Best Sellers

          </p>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">

            Customer Favorites

          </h2>

          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-9">

            Discover the fragrances loved most by our customers.

          </p>

        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">

          {bestsellerProducts.map((product) => (

            <ProductCard
              key={product._id}
              product={product}
            />

          ))}

        </div>

      </div>

    </section>

  );

}