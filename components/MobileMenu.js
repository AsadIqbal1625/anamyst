"use client";

import Link from "next/link";

export default function MobileMenu({
  isOpen,
  setIsOpen,
}) {

  return (

    <>

      {/* OVERLAY */}

      {isOpen && (

        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />

      )}

      {/* SIDEBAR */}

      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 shadow-2xl transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* HEADER */}

        <div className="bg-black text-white p-5 flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-300">
              Welcome to
            </p>

            <h2 className="text-2xl font-bold tracking-wide">
              ANAMYST
            </h2>

          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="text-3xl"
          >
            ×
          </button>

        </div>

        {/* MENU */}

        <div className="p-5 space-y-5 text-lg font-medium">

          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block hover:text-[#D4AF37]"
          >
            Home
          </Link>

          <Link
            href="/shop"
            onClick={() => setIsOpen(false)}
            className="block hover:text-[#D4AF37]"
          >
            Shop
          </Link>

          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="block hover:text-[#D4AF37]"
          >
            About
          </Link>

          <Link
            href="/faq"
            onClick={() => setIsOpen(false)}
            className="block hover:text-[#D4AF37]"
          >
            FAQ
          </Link>

          <Link
            href="/cart"
            onClick={() => setIsOpen(false)}
            className="block hover:text-[#D4AF37]"
          >
            Cart
          </Link>

          <div className="border-t pt-5">

            <p className="text-gray-500 text-sm mb-3">
              Categories
            </p>

            <div className="space-y-3 text-base">

              <p>Luxury Perfumes</p>

              <p>Men Collection</p>

              <p>Women Collection</p>

              <p>Unisex</p>

            </div>

          </div>

        </div>

      </div>

    </>

  );
}