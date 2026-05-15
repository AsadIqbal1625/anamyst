"use client";

import Link from "next/link";

export default function MobileMenu({ isOpen, setIsOpen }) {

  if (!isOpen) return null;

  return (

    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[998]"
        onClick={() => setIsOpen(false)}
      />

      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-[82%] max-w-[340px] bg-[#0d0d0d] z-[999] shadow-2xl overflow-y-auto flex flex-col">

        {/* TOP SECTION */}
        <div className="relative px-6 pt-8 pb-10 border-b border-white/10">

          {/* CLOSE */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 text-white text-4xl font-light"
          >
            ×
          </button>

          {/* BRAND */}
          <p className="text-gray-400 text-sm tracking-widest uppercase mb-3">
            Luxury Fragrance House
          </p>

          <h1 className="text-white text-5xl font-bold tracking-[0.25em] leading-tight">
            ANAMYST
          </h1>

          <p className="text-gray-400 mt-4 text-sm leading-6">
            Crafted premium fragrances
            for elegance, identity and presence.
          </p>

        </div>

        {/* MENU */}
        <div className="flex flex-col py-4">

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="group px-6 py-5 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-all duration-300"
          >

            <span className="text-white text-xl tracking-wide">
              Home
            </span>

            <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition">
              →
            </span>

          </Link>

          <Link
            href="/shop"
            onClick={() => setIsOpen(false)}
            className="group px-6 py-5 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-all duration-300"
          >

            <span className="text-white text-xl tracking-wide">
              Shop
            </span>

            <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition">
              →
            </span>

          </Link>

          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="group px-6 py-5 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-all duration-300"
          >

            <span className="text-white text-xl tracking-wide">
              About
            </span>

            <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition">
              →
            </span>

          </Link>

          <Link
            href="/faq"
            onClick={() => setIsOpen(false)}
            className="group px-6 py-5 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-all duration-300"
          >

            <span className="text-white text-xl tracking-wide">
              FAQ
            </span>

            <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition">
              →
            </span>

          </Link>

          <Link
            href="/cart"
            onClick={() => setIsOpen(false)}
            className="group px-6 py-5 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-all duration-300"
          >

            <span className="text-white text-xl tracking-wide">
              Cart
            </span>

            <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition">
              →
            </span>

          </Link>

        </div>

        {/* COLLECTIONS */}
        <div className="px-6 py-8 border-t border-white/10 mt-auto">

          <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs mb-6">
            Collections
          </p>

          <div className="space-y-4">

            <div className="bg-white/5 rounded-2xl px-5 py-4 border border-white/5">
              <p className="text-white text-lg">
                Luxury Perfumes
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl px-5 py-4 border border-white/5">
              <p className="text-white text-lg">
                Men Collection
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl px-5 py-4 border border-white/5">
              <p className="text-white text-lg">
                Women Collection
              </p>
            </div>

          </div>

        </div>

      </div>
    </>

  );
}