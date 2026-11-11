"use client";

import Link from "next/link";
import { SORTS } from "../lib/shopFilters";

/* One slim bar instead of a big page header: every part of it does
   something (switch collection, filter, sort). The page heading is kept
   for search engines and screen readers, but not shown. */

export default function ShopToolbar({
  heading,
  tabs,
  genders = [],
  gender,
  onGender,
  sort,
  onSort,
  total,
}) {

  const tabClass = (active) =>
    `shrink-0 py-1 border-b text-[11px] uppercase tracking-[0.2em] transition-colors ${
      active
        ? "border-gold text-white"
        : "border-transparent text-white/50 hover:text-white"
    }`;

  const tabLabel = (t) => (
    <>
      {t.label}
      {t.count > 0 && <span className="ml-1.5 text-white/30">{t.count}</span>}
    </>
  );

  return (

    <section className="px-6 border-b border-white/10">

      <h1 className="sr-only">{heading}</h1>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-x-8 gap-y-3 py-4">

        {/* COLLECTIONS — swipe sideways on phones */}
        <nav
          aria-label="Collections"
          className="scent-rail -mx-6 px-6 lg:mx-0 lg:px-0 flex gap-6 overflow-x-auto"
        >

          {tabs.map((t) =>
            t.href ? (

              <Link
                key={t.label}
                href={t.href}
                aria-current={t.active ? "page" : undefined}
                className={tabClass(t.active)}
              >
                {tabLabel(t)}
              </Link>

            ) : (

              <button
                key={t.label}
                type="button"
                onClick={t.onSelect}
                aria-pressed={t.active}
                className={tabClass(t.active)}
              >
                {tabLabel(t)}
              </button>

            )
          )}

        </nav>

        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">

          {/* MEN / WOMEN / UNISEX, only when the products differ */}
          {genders.length > 0 && (

            <div className="flex border border-white/15 rounded-full p-0.5">

              {genders.map((g) => (

                <button
                  key={g}
                  type="button"
                  onClick={() => onGender(g)}
                  aria-pressed={gender === g}
                  className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.15em] transition-colors ${
                    gender === g
                      ? "bg-gold text-black"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {g}
                </button>

              ))}

            </div>

          )}

          <div className="flex items-center gap-3">

            <span className="text-white/40 text-[11px] uppercase tracking-[0.2em]">
              {total} {total === 1 ? "item" : "items"}
            </span>

            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => onSort(e.target.value)}
              className="bg-transparent border border-white/15 hover:border-gold/60 focus:border-gold rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-white/80 outline-none cursor-pointer transition-colors"
            >

              {SORTS.map((s) => (
                <option key={s.value} value={s.value} className="bg-black text-white">
                  {s.label}
                </option>
              ))}

            </select>

          </div>

        </div>

      </div>

    </section>

  );

}
