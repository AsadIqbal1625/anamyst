"use client";

import {
  Suspense,
  useMemo,
  useState,
  useEffect,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import ProductCard
from "../../components/ProductCard";

function ShopContent({ initialProducts }) {

  const searchParams =
    useSearchParams();

  const search =
    searchParams
      .get("search")
      ?.toLowerCase() || "";

  /* CATEGORY FILTER */
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  /* GENDER FILTER */
  const [
    selectedGender,
    setSelectedGender,
  ] = useState("All");

 const [products,
  setProducts] =
  useState(initialProducts || []);

  /* PRODUCTS ARE NOW SERVER-SIDE RENDERED */
        useEffect(() => {

          setProducts(
            initialProducts || []
          );

        }, [initialProducts]);

  /* FILTER PRODUCTS */
  const filteredProducts =
    useMemo(() => {

      return products.filter(
        (product) => {

          /* CATEGORY MATCH */
          const matchesCategory =

            selectedCategory === "All" ||

            product.category
              ?.toLowerCase() ===
            selectedCategory
              .toLowerCase();

          /* GENDER MATCH */
          const matchesGender =

            selectedGender === "All" ||

            product.genderCategory
              ?.toLowerCase() ===
            selectedGender
              .toLowerCase();

          /* SEARCH MATCH */
          const matchesSearch =

            product.name
              ?.toLowerCase()
              .includes(search) ||

            product.description
              ?.toLowerCase()
              .includes(search) ||

            product.category
              ?.toLowerCase()
              .includes(search) ||

            product.genderCategory
              ?.toLowerCase()
              .includes(search) ||

            product.notesTags?.some(
              (tag) =>
                tag
                  ?.toLowerCase()
                  .includes(search)
            );

          return (

            matchesCategory &&
            matchesGender &&
            matchesSearch

          );

        }
      );

    }, [

      products,
      search,
      selectedCategory,
      selectedGender,

    ]);

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* HEADER (compact) */}
      <section className="relative px-6 py-8 md:py-10 border-b border-[#D4AF37]/20">

        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent" />

        <div className="relative max-w-7xl mx-auto flex flex-wrap items-end justify-between gap-4">

          <div>

            <p className="uppercase tracking-[5px] text-[#D4AF37] text-[10px] mb-2">

              ANAMYST Collection

            </p>

            <h1 className="text-3xl md:text-5xl font-bold">

              Luxury Fragrances

            </h1>

          </div>

          <p className="text-gray-400 text-sm max-w-md leading-6">

            Premium perfumes crafted for elegance,
            confidence, and timeless sophistication.

          </p>

        </div>

      </section>

      {/* FILTERS */}
        <section className="px-6 py-10">

          {/* DESKTOP FILTERS */}
          <div className="hidden md:flex flex-col items-center gap-5">

            {/* CATEGORY */}
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-full px-3 py-2">

              {[
                "All",
                "Perfumes",
                "Attars",
                "Fresheners",
                "Premium Gifts",
                "Combos",
              ].map((cat) => (

                <button
                  key={cat}
                  onClick={() =>
                    setSelectedCategory(cat)
                  }
                  className={`px-5 py-2 rounded-full text-xs uppercase tracking-[0.18em] transition-all duration-300

                  ${
                    selectedCategory === cat

                      ? "bg-[#D4AF37] text-black"

                      : "text-gray-400 hover:text-white"
                  }
                  `}
                >

                  {cat}

                </button>

              ))}

            </div>

            {/* GENDER */}
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-full px-3 py-2">

              {[
                "All",
                "Men",
                "Women",
                "Unisex",
              ].map((gender) => (

                <button
                  key={gender}
                  onClick={() =>
                    setSelectedGender(gender)
                  }
                  className={`px-5 py-2 rounded-full text-xs uppercase tracking-[0.18em] transition-all duration-300

                  ${
                    selectedGender === gender

                      ? "bg-[#D4AF37] text-black"

                      : "text-gray-400 hover:text-white"
                  }
                  `}
                >

                  {gender}

                </button>

              ))}

            </div>

          </div>
              {/* MOBILE FILTERS */}
          <div className="md:hidden flex flex-col items-center gap-5 px-2">

            {/* CATEGORY */}
            <div className="flex flex-wrap justify-center gap-3 max-w-sm">

              {[
                "All",
                "Perfumes",
                "Attars",
                "Fresheners",
                "Premium Gifts",
                "Combos",
              ].map((cat) => (

                <button
                  key={cat}
                  onClick={() =>
                    setSelectedCategory(cat)
                  }
                  className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.18em] transition-all duration-300 border

                  ${
                    selectedCategory === cat

                      ? "bg-[#D4AF37] text-black border-[#D4AF37]"

                      : "bg-white/[0.03] text-gray-400 border-white/10"
                  }
                  `}
                >

                  {cat}

                </button>

              ))}

            </div>

            {/* GENDER */}
            <div className="flex items-center justify-center gap-2 bg-white/[0.03] border border-white/10 rounded-full px-2 py-2">

              {[
                "All",
                "Men",
                "Women",
                "Unisex",
              ].map((gender) => (

                <button
                  key={gender}
                  onClick={() =>
                    setSelectedGender(
                      gender
                    )
                  }
                  className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.18em] transition-all duration-300

                  ${
                    selectedGender === gender

                      ? "bg-[#D4AF37] text-black"

                      : "text-gray-400"
                  }
                  `}
                >

                  {gender}

                </button>

              ))}

            </div>

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

export default function ShopClient({
  initialProducts,
}) {

  return (

    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">
          Loading...
        </div>
      }
    >

      <ShopContent
        initialProducts={initialProducts}
      />

    </Suspense>

  );

}