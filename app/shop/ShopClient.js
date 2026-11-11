"use client";

import { useMemo, useState } from "react";
import ProductCard from "../../components/ProductCard";
import ShopToolbar from "../../components/ShopToolbar";
import {
  COLLECTIONS,
  countByCollection,
  filterAndSort,
  gendersIn,
} from "../../lib/shopFilters";

/* search comes from the server (already lower-cased), so the full
   product list is in the page HTML from the first byte */

export default function ShopClient({ initialProducts = [], search = "" }) {

  const [category, setCategory] = useState("All");
  const [gender, setGender] = useState("All");
  const [sort, setSort] = useState("featured");

  const searched = useMemo(() => {

    if (!search) return initialProducts;

    return initialProducts.filter((p) =>
      [p.name, p.description, p.category, p.genderCategory, ...(p.notesTags || [])]
        .some((value) => String(value || "").toLowerCase().includes(search))
    );

  }, [initialProducts, search]);

  const counts = useMemo(() => countByCollection(searched), [searched]);

  const shown = useMemo(
    () => filterAndSort(searched, { category, gender, sort }),
    [searched, category, gender, sort]
  );

  const tabs = [
    {
      label: "All",
      active: category === "All",
      onSelect: () => setCategory("All"),
    },
    ...COLLECTIONS.filter((c) => counts[c.label] > 0).map((c) => ({
      label: c.label,
      count: counts[c.label],
      active: category === c.label,
      onSelect: () => setCategory(c.label),
    })),
  ];

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden">

      <ShopToolbar
        heading="Luxury Fragrances by ANAMYST"
        tabs={tabs}
        genders={gendersIn(searched)}
        gender={gender}
        onGender={setGender}
        sort={sort}
        onSort={setSort}
        total={shown.length}
      />

      {search && (

        <p className="max-w-7xl mx-auto px-6 pt-6 text-white/60 text-sm">
          Results for <span className="text-gold">&ldquo;{search}&rdquo;</span>
        </p>

      )}

      <section className="px-6 pt-6 pb-20">

        {shown.length > 0 ? (

          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {shown.map((product, index) => (

              <ProductCard
                key={product._id}
                product={product}
                priority={index < 4}
              />

            ))}

          </div>

        ) : (

          <div className="text-center py-20">

            <h2 className="text-3xl font-light mb-4">No Products Found</h2>

            <p className="text-white/60">Try another search or category.</p>

          </div>

        )}

      </section>

    </div>

  );

}
