"use client";

import Link from "next/link";

export default function MobileMenu({ isOpen, setIsOpen }) {

  return (

    <>
      {/* OVERLAY */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] transition-all duration-300 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-screen w-[88%] max-w-[360px] bg-[#0a0a0a] z-[999] shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* HEADER */}
        <div className="relative px-6 pt-10 pb-8 border-b border-white/10">

          {/* CLOSE BUTTON */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-white text-4xl font-light"
          >
            ×
          </button>

          {/* SMALL TEXT */}
          <p className="text-gray-400 text-sm tracking-[0.25em] uppercase mb-4">

            Welcome To

          </p>

          {/* LOGO TEXT */}
          <h1 className="text-white text-5xl font-bold tracking-[0.18em] leading-none break-words">

            ANAMYST

          </h1>

          {/* SUBTEXT */}
          <p className="text-gray-400 text-sm mt-5 leading-7 max-w-[260px]">

            Discover premium fragrances crafted for elegance and presence.

          </p>

        </div>

        {/* MENU ITEMS */}
        <div className="py-3">

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-6 py-5 border-b border-white/5 hover:bg-white/5 transition-all duration-300 group"
          >

            <span className="text-white text-2xl font-light">
              Home
            </span>

            <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition">
              →
            </span>

          </Link>

          <Link
            href="/shop"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-6 py-5 border-b border-white/5 hover:bg-white/5 transition-all duration-300 group"
          >

            <span className="text-white text-2xl font-light">
              Shop
            </span>

            <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition">
              →
            </span>

          </Link>

          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-6 py-5 border-b border-white/5 hover:bg-white/5 transition-all duration-300 group"
          >

            <span className="text-white text-2xl font-light">
              About
            </span>

            <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition">
              →
            </span>

          </Link>

          <Link
            href="/faq"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-6 py-5 border-b border-white/5 hover:bg-white/5 transition-all duration-300 group"
          >

            <span className="text-white text-2xl font-light">
              FAQ
            </span>

            <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition">
              →
            </span>

          </Link>

          <Link
            href="/cart"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-6 py-5 border-b border-white/5 hover:bg-white/5 transition-all duration-300 group"
          >

            <span className="text-white text-2xl font-light">
              Cart
            </span>

            <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition">
              →
            </span>

          </Link>

        </div>

        {/* FOOTER */}
        <div className="mt-auto px-6 py-8 border-t border-white/10">

          <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase mb-6">

            Collections

          </p>

          <div className="space-y-4">

            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">

              <p className="text-white text-lg">
                Luxury Perfumes
              </p>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">

              <p className="text-white text-lg">
                Men Collection
              </p>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">

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