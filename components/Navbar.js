"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getCart } from "../lib/cart";
import { useRouter } from "next/navigation";

export default function Navbar() {

  const router = useRouter();

  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {

    const cart = getCart();

    const totalQty = cart.reduce(
      (sum, item) => sum + item.qty,
      0
    );

    setCartCount(totalQty);

  }, []);

  return (

    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10 w-full overflow-x-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">

        {/* TOP SECTION */}
        <div className="w-full flex items-center justify-between gap-4">

          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
          >

            <Image
              src="/logo.jpeg"
              alt="ANAMYST"
              width={48}
              height={48}
              className="rounded-xl object-cover"
            />

            <h1 className="text-white text-2xl sm:text-4xl font-semibold tracking-[0.25em] hover:text-[#D4AF37] transition duration-300">

              ANAMYST

            </h1>

          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden lg:flex items-center gap-6 text-white text-sm uppercase font-medium">

            <Link
              href="/"
             className="relative text-white text-sm uppercase font-medium transition duration-300 active:text-[#D4AF37] hover:text-[#D4AF37]"
>
              Home
            </Link>

            <Link
              href="/shop"
              className="relative text-white text-sm uppercase font-medium transition duration-300 active:text-[#D4AF37] hover:text-[#D4AF37]"
>
              Shop
            </Link>

            <Link
              href="/about"
              className="relative text-white text-sm uppercase font-medium transition duration-300 active:text-[#D4AF37] hover:text-[#D4AF37]"
>
              About
            </Link>

            <Link
              href="/faq"
              className="relative text-white text-sm uppercase font-medium transition duration-300 active:text-[#D4AF37] hover:text-[#D4AF37]"
>
              FAQ
            </Link>

            <Link
              href="/cart"
              className="relative text-white text-sm uppercase font-medium transition duration-300 active:text-[#D4AF37] hover:text-[#D4AF37]"
            >

              Cart

              {cartCount > 0 && (

                <span className="absolute -top-2 -right-3 bg-[#D4AF37] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">

                  {cartCount}

                </span>

              )}

            </Link>

          </div>

        </div>

        {/* SEARCH */}
        <div className="w-full lg:max-w-2xl">

          <input
            type="text"
            placeholder="Search perfumes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {

              if (e.key === "Enter") {

                router.push(
                  `/shop?search=${search}`
                );

              }

            }}
            className="w-full px-5 py-3 rounded-full bg-white/10 border border-[#D4AF37] text-white placeholder:text-gray-300 outline-none focus:border-[#D4AF37] transition"
          />

        </div>

        {/* MOBILE MENU */}
        <div className="flex lg:hidden flex-wrap justify-center items-center gap-4 text-white text-sm uppercase font-medium pb-2">

          <Link
            href="/"
            className="text-white text-sm uppercase font-medium transition duration-300 active:text-[#D4AF37] hover:text-[#D4AF37]">
            Home
          </Link>

          <Link
            href="/shop"
            className="text-white text-sm uppercase font-medium transition duration-300 active:text-[#D4AF37] hover:text-[#D4AF37]">
            Shop
          </Link>

          <Link
            href="/about"
            className="text-white text-sm uppercase font-medium transition duration-300 active:text-[#D4AF37] hover:text-[#D4AF37]"
>
            About
          </Link>

          <Link
            href="/faq"
            className="text-white text-sm uppercase font-medium transition duration-300 active:text-[#D4AF37] hover:text-[#D4AF37]"
>
            FAQ
          </Link>

          <Link
            href="/cart"
            className="text-white text-sm uppercase font-medium transition duration-300 active:text-[#D4AF37] hover:text-[#D4AF37]"
>

            Cart

            {cartCount > 0 && (

              <span className="absolute -top-2 -right-3 bg-[#D4AF37] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">

                {cartCount}

              </span>

            )}

          </Link>

        </div>

      </div>

    </nav>
  );
}