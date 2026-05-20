"use client";

import {
  Suspense,
  useMemo,
  useState,
  useEffect,
} from "react";

import { useSearchParams }
from "next/navigation";

import ProductCard
from "../../components/ProductCard";

function ShopContent() {

  const searchParams =
    useSearchParams();

  const search =

    searchParams
      .get("search")
      ?.toLowerCase() || "";

  const [selectedCategory,
    setSelectedCategory] =
    useState("All");

  const [products,
    setProducts] =
    useState([]);

  /* FETCH PRODUCTS */
  useEffect(() => {

    async function fetchProducts() {

      try {

        const res =
          await fetch(
            "/api/products"
          );

        const data =
          await res.json();

        if (data.success) {

          setProducts(
            data.products
          );

        }

      } catch (error) {

        console.log(error);

      }

    }

    fetchProducts();

  }, []);

  /* FILTER */
  const filteredProducts =
    useMemo(() => {

      return products.filter(
        (product) => {

          const matchesCategory =

            selectedCategory ===
              "All" ||

            product.category
              .toLowerCase() ===
            selectedCategory
              .toLowerCase();

          const matchesSearch =

            product.name
              .toLowerCase()
              .includes(search) ||

            product.description
              .toLowerCase()
              .includes(search) ||

            product.category
              .toLowerCase()
              .includes(search) ||

            product.notesTags.some(
              (tag) =>
                tag
                  .toLowerCase()
                  .includes(search)
            );

          return (
            matchesCategory &&
            matchesSearch
          );

        }
      );

    }, [
      products,
      search,
      selectedCategory,
    ]);

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* HERO */}
      <section className="relative px-6 py-20 border-b border-[#D4AF37]/20">

        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent" />

        <div className="relative max-w-6xl mx-auto text-center">

          <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-5">

            ANAMYST Collection

          </p>

          <h1 className="text-5xl md:text-7xl font-bold mb-8">

            Luxury Fragrances

          </h1>

          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-9">

            Discover premium perfumes crafted
            for elegance, confidence,
            and timeless sophistication.

          </p>

        </div>

      </section>

      {/* FILTERS */}
      <section className="px-6 py-10">

        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-4">

          {[
            "All",
            "Men",
            "Women",
            "Unisex",
          ].map((cat) => (

            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(
                  cat
                )
              }
              className={`px-7 py-3 rounded-full border transition duration-300 text-sm uppercase tracking-wide

              ${
                selectedCategory ===
                cat

                  ? "bg-[#D4AF37] text-black border-[#D4AF37]"

                  : "bg-white/5 text-white border-white/10 hover:border-[#D4AF37]"
              }
              `}
            >

              {cat}

            </button>

          ))}

        </div>

      </section>

      {/* SEARCH RESULT */}
      {search && (

        <div className="text-center mb-10">

          <p className="text-gray-300 text-lg">

            Showing results for:

            <span className="text-[#D4AF37] font-semibold ml-2">

              "{search}"

            </span>

          </p>

        </div>

      )}

      {/* PRODUCTS */}
      <section className="px-6 pb-20">

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

          {filteredProducts.map(
            (product) => (

              <ProductCard
                key={product._id}
                product={product}
              />

            )
          )}

        </div>

      </section>

      {/* EMPTY */}
      {filteredProducts.length === 0 && (

        <div className="text-center pb-24">

          <h2 className="text-4xl font-bold mb-5">

            No Products Found

          </h2>

          <p className="text-gray-400">

            Try another search
            or category.

          </p>

        </div>

      )}

    </div>

  );

}

export default function ShopPage() {

  return (

    <Suspense
      fallback={

        <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">

          Loading...

        </div>

      }
    >

      <ShopContent />

    </Suspense>

  );

}