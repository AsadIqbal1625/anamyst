"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { products } from "../../data/products";
import ProductCard from "../../components/ProductCard";

function ShopContent() {

  const searchParams = useSearchParams();

  const search =
    searchParams.get("search")?.toLowerCase() || "";

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const filteredProducts = useMemo(() => {

    return products.filter((product) => {

      const matchesCategory =

        selectedCategory === "All" ||

        product.category.toLowerCase() ===
          selectedCategory.toLowerCase();

      const matchesSearch =

        product.name.toLowerCase().includes(search) ||

        product.description
          .toLowerCase()
          .includes(search) ||

        product.category
          .toLowerCase()
          .includes(search) ||

        product.notesTags.some((tag) =>
          tag.toLowerCase().includes(search)
        );

      return matchesCategory && matchesSearch;

    });

  }, [search, selectedCategory]);

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-[#faf7f2] to-[#f3f3f3] px-4 sm:px-6 md:px-10 py-10">

      {/* TITLE */}
      <div className="text-center mb-12">

        <h1 className="text-5xl font-bold tracking-wide mb-4">
          Our Collection
        </h1>

        <p className="text-gray-600 text-lg">
          Discover premium luxury fragrances crafted for elegance
        </p>

      </div>

      {/* CATEGORY FILTER */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">

        {["All", "Men", "Women", "Unisex"].map((cat) => (

          <button
            key={cat}
            onClick={() =>
              setSelectedCategory(cat)
            }
            className={`px-6 py-3 rounded-full text-sm uppercase tracking-wide transition duration-300 border

            ${
              selectedCategory === cat
                ? "bg-black text-white border-black shadow-lg"
                : "bg-white text-black border-gray-300 hover:border-black hover:bg-black hover:text-white"
            }
          `}
          >

            {cat}

          </button>

        ))}

      </div>

      {/* SEARCH TEXT */}
      {search && (

        <div className="text-center mb-10">

          <p className="text-gray-600 text-2xl">

            Showing results for:
            <span className="font-bold text-black ml-2">
              "{search}"
            </span>

          </p>

        </div>

      )}

      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">

        {filteredProducts.map((product) => (

          <div className="h-full">
  <   ProductCard
        key={product.id}
        product={product}
      />
    </div>

        ))}

      </div>

      {/* NO RESULTS */}
      {filteredProducts.length === 0 && (

        <div className="text-center mt-20">

          <h2 className="text-3xl font-semibold mb-4">

            No perfumes found 😔

          </h2>

          <p className="text-gray-500">

            Try another search keyword

          </p>

        </div>

      )}

    </div>

  );
}

export default function ShopPage() {

  return (

    <Suspense fallback={<div>Loading...</div>}>

      <ShopContent />

    </Suspense>

  );
}