"use client";

import Link from "next/link";
import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

import { getCart }
from "../lib/cart";

import {
  useRouter,
} from "next/navigation";

import MobileMenu
from "./MobileMenu";

export default function Navbar() {

  const router =
    useRouter();

  const [search,
    setSearch] =
    useState("");

  const [cartCount,
    setCartCount] =
    useState(0);

  const [isOpen,
    setIsOpen] =
    useState(false);

  /* CART COUNT */
  useEffect(() => {

    const updateCartCount =
      () => {

        const cart =
          getCart();

        const totalQty =
          cart.reduce(

            (sum, item) =>

              sum +
              item.quantity,

            0

          );

        setCartCount(
          totalQty
        );

      };

    updateCartCount();

    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    return () => {

      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );

    };

  }, []);

  return (

    <>

      {/* MOBILE MENU */}
      <MobileMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-30 bg-black/95 backdrop-blur-xl border-b border-white/10 w-full">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">

          {/* TOP */}
          <div className="flex items-center justify-between gap-3">

            {/* LEFT */}
            <div className="flex items-center gap-3">

              {/* HAMBURGER */}
              <button
                onClick={() =>
                  setIsOpen(true)
                }
                className="lg:hidden text-white text-3xl"
              >

                ☰

              </button>

              {/* LOGO */}
              <Link
                href="/"
                className="flex items-center gap-3"
              >

                <Image
                  src="/logo.jpeg"
                  alt="ANAMYST"
                  width={42}
                  height={42}
                  className="rounded-lg object-cover"
                />

                <h1 className="text-white text-2xl sm:text-4xl font-bold tracking-[0.2em]">

                  ANAMYST

                </h1>

              </Link>

            </div>

            {/* DESKTOP MENU */}
            <div className="hidden lg:flex items-center gap-6 text-white text-sm uppercase font-medium">

              {/* HOME */}
              <Link
                href="/"
                className="hover:text-[#D4AF37] transition duration-300"
              >

                Home

              </Link>

              {/* COLLECTIONS */}
              <div className="relative group">

                <button className="flex items-center gap-2 hover:text-[#D4AF37] transition duration-300">

                  COLLECTIONS

                  <span className="text-xs">

                    ▼

                  </span>

                </button>

                {/* DROPDOWN */}
                <div className="absolute top-full left-0 mt-5 w-[300px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-3xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-2xl">

                  <div className="space-y-3">

                    {/* ALL COLLECTIONS */}
                    <Link
                      href="/shop"
                      className="block bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl p-4 hover:bg-[#D4AF37]/20 transition duration-300"
                    >

                      <p className="text-[#D4AF37] text-base font-semibold">

                        All Collections

                      </p>

                      <p className="text-gray-400 text-xs mt-1">

                        Explore every ANAMYST collection

                      </p>

                    </Link>

                    {/* PERFUMES */}
                    <Link
                      href="/shop/perfumes"
                      className="block bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition duration-300"
                    >

                      <p className="text-white text-base font-semibold">

                        Perfumes

                      </p>

                      <p className="text-gray-400 text-xs mt-1">

                        Signature luxury fragrances

                      </p>

                    </Link>

                    {/* ATTARS */}
                    <Link
                      href="/shop/attars"
                      className="block bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition duration-300"
                    >

                      <p className="text-white text-base font-semibold">

                        Attars

                      </p>

                      <p className="text-gray-400 text-xs mt-1">

                        Traditional premium attars

                      </p>

                    </Link>

                    {/* FRESHENERS */}
                    <Link
                      href="/shop/fresheners"
                      className="block bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition duration-300"
                    >

                      <p className="text-white text-base font-semibold">

                        Fresheners

                      </p>

                      <p className="text-gray-400 text-xs mt-1">

                        Refresh your surroundings

                      </p>

                    </Link>

                    {/* GIFTS */}
                    <Link
                      href="/shop/premium-gifts"
                      className="block bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition duration-300"
                    >

                      <p className="text-white text-base font-semibold">

                        Premium Gifts

                      </p>

                      <p className="text-gray-400 text-xs mt-1">

                        Elegant gifting collections

                      </p>

                    </Link>

                    {/* COMBOS */}
                    <Link
                      href="/shop/combos"
                      className="block bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition duration-300"
                    >

                      <p className="text-white text-base font-semibold">

                        Combos

                      </p>

                      <p className="text-gray-400 text-xs mt-1">

                        Curated fragrance bundles

                      </p>

                    </Link>

                  </div>

                </div>

              </div>

              {/* ABOUT */}
              <Link
                href="/about"
                className="hover:text-[#D4AF37] transition duration-300"
              >

                About

              </Link>

              {/* FAQ */}
              <Link
                href="/faq"
                className="hover:text-[#D4AF37] transition duration-300"
              >

                FAQ

              </Link>

              {/* CART */}
              <Link
                href="/cart"
                className="relative hover:text-[#D4AF37] transition duration-300"
              >

                Cart

                {cartCount > 0 && (

                  <span className="absolute -top-2 -right-4 bg-[#D4AF37] text-black text-xs font-bold min-w-[22px] h-[22px] rounded-full flex items-center justify-center px-1">

                    {cartCount}

                  </span>

                )}

              </Link>

            </div>

          </div>

          {/* SEARCH */}
          <div className="mt-4">

            <input
              type="text"
              placeholder="Search luxury collections..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {

                  router.push(

                    `/shop?search=${search}`

                  );

                }

              }}
              className="w-full px-5 py-4 rounded-full bg-white/10 border border-[#D4AF37] text-white placeholder:text-gray-300 outline-none focus:border-[#D4AF37] transition"
            />

          </div>

        </div>

      </nav>

      {/* MOBILE FLOATING CART */}
      <Link
        href="/cart"
        className="md:hidden fixed bottom-6 right-5 z-[9999]"
      >

        <div className="relative bg-black text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border border-[#D4AF37]">

          <span className="text-2xl">

            🛒

          </span>

          {cartCount > 0 && (

            <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">

              {cartCount}

            </span>

          )}

        </div>

      </Link>

    </>

  );

}