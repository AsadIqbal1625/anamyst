"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getCart } from "../lib/cart";
import { useRouter } from "next/navigation";
import MobileMenu from "./MobileMenu";

export default function Navbar() {

  const router = useRouter();

  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {

    const cart = getCart();

    const totalQty = cart.reduce(
      (sum, item) => sum + item.qty,
      0
    );

    setCartCount(totalQty);

  }, []);

  return (

    <>
      {/* MOBILE SIDEBAR */}
      <MobileMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-30 bg-black/95 backdrop-blur-xl border-b border-white/10 w-full">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">

          {/* TOP BAR */}
          <div className="flex items-center justify-between gap-3">

            {/* LEFT SIDE */}
            <div className="flex items-center gap-3">

              {/* HAMBURGER */}
              <button
                onClick={() => setIsOpen(true)}
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

              <Link
                href="/cart"
                className="relative hover:text-[#D4AF37] transition"
              >

                Cart

                {cartCount > 0 && (

                  <span className="absolute -top-2 -right-4 bg-[#D4AF37] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">

                    {cartCount}

                  </span>

                )}

              </Link>

            </div>

          </div>

          {/* SEARCH BAR */}
          <div className="mt-4">

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
              className="w-full px-5 py-4 rounded-full bg-white/10 border border-[#D4AF37] text-white placeholder:text-gray-300 outline-none focus:border-[#D4AF37] transition"
            />

          </div>

        </div>

      </nav>
    </>

  );
}