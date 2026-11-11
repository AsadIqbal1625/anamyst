"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "../../../components/ProductCard";
import ShopToolbar from "../../../components/ShopToolbar";
import { COLLECTIONS, filterAndSort, gendersIn } from "../../../lib/shopFilters";

/* Products arrive already rendered from the server; no loading screen. */

export default function CategoryClient({
  category,
  initialProducts = [],
  counts = {},
}) {

  const [gender, setGender] = useState("All");
  const [sort, setSort] = useState("featured");

  const current = COLLECTIONS.find((c) => c.slug === category);

  /* an unknown collection in the address bar: show it as typed, tidied up */
  const name =
    current?.label ||
    String(category)
      .replace(/[^a-zA-Z0-9]+/g, " ")
      .trim()
      .replace(/\b\w/g, (ch) => ch.toUpperCase()) ||
    "Collection";

  const shown = filterAndSort(initialProducts, { gender, sort });

  /* tabs link between collections; empty ones stay hidden */
  const tabs = [
    { label: "All", href: "/shop", active: false },
    ...COLLECTIONS.filter((c) => counts[c.label] > 0 || c.slug === category).map(
      (c) => ({
        label: c.label,
        count: counts[c.label],
        href: `/shop/${c.slug}`,
        active: c.slug === category,
      })
    ),
  ];

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden">

      <ShopToolbar
        heading={`${name} by ANAMYST`}
        tabs={tabs}
        genders={gendersIn(initialProducts)}
        gender={gender}
        onGender={setGender}
        sort={sort}
        onSort={setSort}
        total={shown.length}
      />

      <section className="px-6 pt-6 pb-20">

        {initialProducts.length === 0 ? (

          <div className="text-center py-20">

            <h2 className="text-3xl font-light mb-4">Coming Soon</h2>

            <p className="text-white/60 mb-8">
              Our {name.toLowerCase()} collection will appear here soon.
            </p>

            <Link
              href="/shop"
              className="inline-block bg-gold text-black px-8 py-4 text-sm uppercase tracking-[0.2em] hover:opacity-90 transition"
            >
              Explore the Shop
            </Link>

          </div>

        ) : (

          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {shown.map((product, index) => (

              <ProductCard
                key={product._id}
                product={product}
                priority={index < 4}
              />

            ))}

          </div>

        )}

      </section>

    </div>

  );

}
