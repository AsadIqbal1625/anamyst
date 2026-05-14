"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart } from "../lib/cart";
import { useRouter } from "next/navigation";

export default function Navbar() {

  const [cartCount, setCartCount] = useState(0);

  const [search, setSearch] = useState("");

  const router = useRouter();

  useEffect(() => {

    const cart = getCart();

    const totalQty = cart.reduce(
      (sum, item) => sum + item.qty,
      0
    );

    setCartCount(totalQty);

  }, []);

  return (

    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#111111]/95 border-b border-white/10">

      <div className="w-full flex items-center justify-between px-4 md:px-8 py-3">

        {/* LEFT */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 group"
        >

          {/* LOGO */}
          <img
            src="/logo.jpeg"
            alt="Anamyst Logo"
            className="h-10 w-10 rounded-lg object-cover"
          />

          {/* BRAND */}
          <h1 className="text-white text-2xl md:text-4xl font-semibold tracking-[0.25em] hover:text-[#D4AF37] transition duration-300">

            ANAMYST

          </h1>

        </Link>

        {/* SEARCH BAR DESKTOP */}
        <div className="hidden lg:flex flex-1 justify-center px-10">

          <input
            type="text"
            placeholder="Search luxury fragrances..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {

                router.push(
                  `/shop?search=${search}`
                );

              }

            }}
            className="w-full max-w-2xl bg-white/10 border border-[#D4AF37] text-white placeholder:text-gray-300 px-6 py-3 rounded-full outline-none focus:border-[#D4AF37]"
          />

        </div>

        {/* RIGHT MENU */}
        <div className="flex items-center gap-4 md:gap-7 text-white text-sm md:text-base uppercase font-medium">

          <Link
            href="/"
            className="hover:text-[#D4AF37] transition"
          >
            Home
          </Link>

          <Link
            href="/shop"
            className="hover:text-[#D4AF37] transition"
          >
            Shop
          </Link>

          {/* HIDE ON MOBILE */}
          <Link
            href="/about"
            className="hover:text-[#D4AF37] transition"
          >
            About
          </Link>

          <Link
            href="/faq"
            className="hover:text-[#D4AF37] transition"
          >
            FAQ
          </Link>

          {/* CART */}
          <Link
            href="/cart"
            className="relative hover:text-[#D4AF37] transition"
          >

            Cart

            {cartCount > 0 && (

              <span className="absolute -top-2 -right-3 bg-[#D4AF37] text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">

                {cartCount}

              </span>

            )}

          </Link>

        </div>

      </div>

      {/* MOBILE SEARCH BAR */}
      <div className="lg:hidden px-4 pb-4">

        <input
          type="text"
          placeholder="Search perfumes..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          onKeyDown={(e) => {

            if (e.key === "Enter") {

              router.push(
                `/shop?search=${search}`
              );

            }

          }}
          className="w-full bg-white/10 border border-[#D4AF37] text-white placeholder:text-gray-300 px-5 py-3 rounded-full outline-none"
        />

      </div>

    </nav>
  );
}