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
        className={`fixed inset-0 bg-black/70 backdrop-blur-md z-[998] transition-all duration-500 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-screen w-[88%] max-w-[360px]
        bg-gradient-to-b from-black via-[#111111] to-black
        border-r border-white/10
        z-[999]
        shadow-2xl
        transform transition-transform duration-500 ease-out
        overflow-y-auto ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* TOP GLOW */}
        <div className="absolute top-0 left-0 w-full h-[240px] bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

        {/* HEADER */}
        <div className="relative px-6 pt-10 pb-8 border-b border-white/10">

          {/* CLOSE BUTTON */}
          <button
            onClick={() =>
              setIsOpen(false)
            }
            className="absolute top-6 right-6 text-white/70 hover:text-[#D4AF37] text-4xl font-light transition duration-300"
          >

            ×

          </button>

          {/* SMALL TEXT */}
          <p className="text-gray-500 text-xs tracking-[0.35em] uppercase mb-5">

            Welcome To

          </p>

          {/* LOGO */}
          <h1 className="text-white text-[52px] font-semibold tracking-[0.18em] leading-none">

            ANAMYST

          </h1>

          {/* SUBTEXT */}
          <p className="text-gray-400 text-sm mt-6 leading-7 max-w-[260px]">

            Discover premium fragrances crafted for elegance,
            luxury, and unforgettable presence.

          </p>

        </div>

        {/* NAVIGATION */}
        <div className="py-4">

          {/* HOME */}
          <Link
            href="/"
            onClick={() =>
              setIsOpen(false)
            }
            className="flex items-center justify-between px-6 py-5 border-b border-white/5 hover:bg-white/[0.03] transition-all duration-500 group"
          >

            <span className="text-white text-2xl font-light">

              Home

            </span>

            <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition duration-500">

              →

            </span>

          </Link>

          {/* ALL COLLECTIONS */}
          <Link
            href="/shop"
            onClick={() =>
              setIsOpen(false)
            }
            className="block mx-4 mt-6 mb-6 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-[28px] px-5 py-5 hover:bg-[#D4AF37]/20 transition duration-500 relative overflow-hidden group"
          >

            {/* CARD GLOW */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

            <div className="relative z-10 flex items-center justify-between">

              <div>

                <p className="text-[#D4AF37] text-xl font-medium">

                  All Collections

                </p>

                <p className="text-gray-400 text-sm mt-2 leading-6">

                  Explore every ANAMYST collection

                </p>

              </div>

              <span className="text-[#D4AF37] text-2xl">

                →

              </span>

            </div>

          </Link>

          {/* COLLECTION TITLE */}
          <div className="px-6 pb-5">

            <p className="text-[#D4AF37] text-xs tracking-[0.35em] uppercase">

              Collections

            </p>

          </div>

          {/* COLLECTION CARDS */}
          {[
            {
              title: "Perfumes",
              desc: "Signature luxury fragrances",
              href: "/shop/perfumes",
            },
            {
              title: "Attars",
              desc: "Traditional premium attars",
              href: "/shop/attars",
            },
            {
              title: "Fresheners",
              desc: "Refresh your surroundings",
              href: "/shop/fresheners",
            },
            {
              title: "Premium Gifts",
              desc: "Elegant gifting collections",
              href: "/shop/premium-gifts",
            },
            {
              title: "Combos",
              desc: "Curated fragrance bundles",
              href: "/shop/combos",
            },
          ].map((item) => (

            <Link
              key={item.title}
              href={item.href}
              onClick={() =>
                setIsOpen(false)
              }
              className="block mx-4 mb-5 rounded-[28px] px-5 py-5 transition-all duration-500 overflow-hidden relative group bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5"
            >

              {/* CARD GLOW */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

              <div className="relative z-10 flex items-center justify-between">

                <div>

                  <p className="text-white text-xl font-medium">

                    {item.title}

                  </p>

                  <p className="text-gray-400 text-sm mt-2 leading-6">

                    {item.desc}

                  </p>

                </div>

                <span className="text-[#D4AF37] text-2xl">

                  →

                </span>

              </div>

            </Link>

          ))}

          {/* EXTRA LINKS */}
          {[
            {
              title: "About",
              href: "/about",
            },
            {
              title: "FAQ",
              href: "/faq",
            },
            {
              title: "Track Order",
              href: "/track-order",
            },
            {
              title: "Cart",
              href: "/cart",
            },
          ].map((item) => (

            <Link
              key={item.title}
              href={item.href}
              onClick={() =>
                setIsOpen(false)
              }
              className="flex items-center justify-between px-6 py-5 border-t border-white/5 hover:bg-white/[0.03] transition-all duration-500 group"
            >

              <span className="text-white text-2xl font-light">

                {item.title}

              </span>

              <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition duration-500">

                →

              </span>

            </Link>

          ))}

        </div>

      </div>

    </>

  );

}