"use client";

import Link from "next/link";

export default function MobileMenu({
  isOpen,
  setIsOpen,
}) {

  return (

    <>

      {/* OVERLAY */}
      <div
        onClick={() =>
          setIsOpen(false)
        }
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
            onClick={() =>
              setIsOpen(false)
            }
            className="absolute top-6 right-6 text-white text-4xl font-light"
          >

            ×

          </button>

          {/* SMALL TEXT */}
          <p className="text-gray-400 text-sm tracking-[0.25em] uppercase mb-4">

            Welcome To

          </p>

          {/* LOGO */}
          <h1 className="text-white text-[52px] font-bold tracking-[0.12em] leading-none">

            ANAMYST

          </h1>

          {/* SUBTEXT */}
          <p className="text-gray-400 text-sm mt-5 leading-7 max-w-[260px]">

            Discover premium fragrances
            crafted for elegance and presence.

          </p>

        </div>

        {/* MAIN NAVIGATION */}
        <div className="py-3">

          {/* HOME */}
          <Link
            href="/"
            onClick={() =>
              setIsOpen(false)
            }
            className="flex items-center justify-between px-6 py-5 border-b border-white/5 hover:bg-white/5 transition-all duration-300 group"
          >

            <span className="text-white text-2xl font-light">

              Home

            </span>

            <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition">

              →

            </span>

          </Link>

          {/* COLLECTIONS TITLE */}
          <div className="px-6 pt-8 pb-4">

            <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase">

              Collections

            </p>

          </div>

          {/* ALL COLLECTIONS */}
          <Link
            href="/shop"
            onClick={() =>
              setIsOpen(false)
            }
            className="block mx-4 mb-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl px-5 py-5 hover:bg-[#D4AF37]/20 transition duration-300"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[#D4AF37] text-xl font-medium">

                  All Collections

                </p>

                <p className="text-gray-400 text-sm mt-2">

                  Explore every ANAMYST collection

                </p>

              </div>

              <span className="text-[#D4AF37] text-2xl">

                →

              </span>

            </div>

          </Link>

          {/* PERFUMES */}
          <Link
            href="/shop/perfumes"
            onClick={() =>
              setIsOpen(false)
            }
            className="block mx-4 mb-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-5 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition duration-300"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-white text-xl font-medium">

                  Perfumes

                </p>

                <p className="text-gray-400 text-sm mt-2">

                  Signature luxury fragrances

                </p>

              </div>

              <span className="text-[#D4AF37] text-2xl">

                →

              </span>

            </div>

          </Link>

          {/* ATTARS */}
          <Link
            href="/shop/attars"
            onClick={() =>
              setIsOpen(false)
            }
            className="block mx-4 mb-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-5 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition duration-300"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-white text-xl font-medium">

                  Attars

                </p>

                <p className="text-gray-400 text-sm mt-2">

                  Traditional premium attars

                </p>

              </div>

              <span className="text-[#D4AF37] text-2xl">

                →

              </span>

            </div>

          </Link>

          {/* FRESHENERS */}
          <Link
            href="/shop/fresheners"
            onClick={() =>
              setIsOpen(false)
            }
            className="block mx-4 mb-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-5 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition duration-300"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-white text-xl font-medium">

                  Fresheners

                </p>

                <p className="text-gray-400 text-sm mt-2">

                  Refresh your surroundings

                </p>

              </div>

              <span className="text-[#D4AF37] text-2xl">

                →

              </span>

            </div>

          </Link>

          {/* PREMIUM GIFTS */}
          <Link
            href="/shop/premium-gifts"
            onClick={() =>
              setIsOpen(false)
            }
            className="block mx-4 mb-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-5 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition duration-300"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-white text-xl font-medium">

                  Premium Gifts

                </p>

                <p className="text-gray-400 text-sm mt-2">

                  Elegant gifting collections

                </p>

              </div>

              <span className="text-[#D4AF37] text-2xl">

                →

              </span>

            </div>

          </Link>

          {/* COMBOS */}
          <Link
            href="/shop/combos"
            onClick={() =>
              setIsOpen(false)
            }
            className="block mx-4 mb-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-5 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition duration-300"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-white text-xl font-medium">

                  Combos

                </p>

                <p className="text-gray-400 text-sm mt-2">

                  Curated fragrance bundles

                </p>

              </div>

              <span className="text-[#D4AF37] text-2xl">

                →

              </span>

            </div>

          </Link>

          {/* ABOUT */}
          <Link
            href="/about"
            onClick={() =>
              setIsOpen(false)
            }
            className="flex items-center justify-between px-6 py-5 border-t border-white/5 hover:bg-white/5 transition-all duration-300 group"
          >

            <span className="text-white text-2xl font-light">

              About

            </span>

            <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition">

              →

            </span>

          </Link>

          {/* FAQ */}
          <Link
            href="/faq"
            onClick={() =>
              setIsOpen(false)
            }
            className="flex items-center justify-between px-6 py-5 border-b border-white/5 hover:bg-white/5 transition-all duration-300 group"
          >

            <span className="text-white text-2xl font-light">

              FAQ

            </span>

            <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition">

              →

            </span>

          </Link>

          {/* CART */}
          <Link
            href="/cart"
            onClick={() =>
              setIsOpen(false)
            }
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

      </div>

    </>

  );

}