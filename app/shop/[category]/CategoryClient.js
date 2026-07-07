"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";


import ProductCard
from "../../../components/ProductCard";

export default function CategoryClient({
  category,
  initialProducts,
}) {



 const [products,
  setProducts] =
  useState(
    initialProducts || []
  );

  const [loading,
    setLoading] =
    useState(true);


    /* PRODUCTS ARE NOW SERVER-SIDE RENDERED */
      useEffect(() => {

        setProducts(
          initialProducts || []
        );

        setLoading(false);

      }, [
        category,
        initialProducts,
      ]);
  

  /* LOADING */
  if (loading) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center text-3xl font-bold">

        Loading...

      </div>

    );

  }

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

            <h1 className="text-3xl md:text-5xl font-bold capitalize">

              {category.replace(
                /-/g,
                " "
              )}

            </h1>

          </div>

          <p className="text-gray-400 text-sm max-w-md leading-6">

            Premium luxury fragrances
            crafted for timeless elegance.

          </p>

        </div>

      </section>

      {/* PRODUCTS */}
      <section className="px-6 py-10">

        <div className="max-w-7xl mx-auto">

          {products.length === 0 ? (

            <div className="text-center py-20">

              <h2 className="text-4xl font-bold mb-5">

                No Products Found

              </h2>

              <p className="text-gray-400 mb-8">

                Products will appear here soon.

              </p>

              <Link
                href="/shop"
                className="inline-block bg-[#D4AF37] text-black px-8 py-4 rounded-2xl font-semibold hover:opacity-90 transition"
              >

                Back to Shop

              </Link>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

              {products.map(
                (product) => (

                  <ProductCard
                    key={product._id}
                    product={product}
                  />

                )
              )}

            </div>

          )}

        </div>

      </section>

    </div>

  );

}