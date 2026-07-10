"use client";

import Link from "next/link";

const collections = [
  { title: "Perfumes", href: "/shop/perfumes" },
  { title: "Attars", href: "/shop/attars" },
  { title: "Fresheners", href: "/shop/fresheners" },
  { title: "Premium Gifts", href: "/shop/premium-gifts" },
  { title: "Combos", href: "/shop/combos" },
];

const pages = [
  { title: "Home", href: "/" },
  { title: "New Launches", href: "/notices" },
  { title: "About", href: "/about" },
  { title: "FAQ", href: "/faq" },
  { title: "Track Order", href: "/track-order" },
  { title: "Cart", href: "/cart" },
];

export default function MobileMenu({
  isOpen,
  setIsOpen,
}) {

  const close = () => setIsOpen(false);

  return (

    <>

      {/* OVERLAY */}
      <div
        onClick={close}
        className={`fixed inset-0 bg-black/70 backdrop-blur-md z-[998] transition-all duration-500 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-[100dvh] w-[85%] max-w-[340px]
        bg-black
        border-r border-[#D4AF37]/20
        z-[999]
        shadow-[0_0_100px_rgba(0,0,0,0.9)]
        transform transition-transform duration-500 ease-out
        flex flex-col ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* HEADER */}
        <div className="relative px-8 pt-8 pb-6 border-b border-white/10 shrink-0">

          {/* CLOSE */}
          <button
            onClick={close}
            aria-label="Close menu"
            className="absolute top-7 right-6 text-white/60 hover:text-[#D4AF37] text-3xl font-light transition duration-300"
          >

            ×

          </button>

          <p className="text-[#D4AF37] text-[10px] tracking-[5px] uppercase mb-3">

            Luxury Fragrance House

          </p>

          <p className="text-white text-2xl font-semibold tracking-[0.3em]">

            ANAMYST

          </p>

        </div>

        {/* SCROLLABLE NAV */}
        <div className="flex-1 overflow-y-auto">

          {/* COLLECTIONS */}
          <div className="px-8 pt-8 pb-2">

            <p className="text-gray-500 text-[10px] tracking-[4px] uppercase mb-4">

              Collections

            </p>

            <Link
              href="/shop"
              onClick={close}
              className="flex items-center justify-between py-3.5 border-b border-white/5 group"
            >

              <span className="text-[#D4AF37] text-lg tracking-[2px] uppercase font-medium">

                Shop All

              </span>

              <span className="text-[#D4AF37]">→</span>

            </Link>

            {collections.map((item) => (

              <Link
                key={item.title}
                href={item.href}
                onClick={close}
                className="flex items-center justify-between py-3.5 border-b border-white/5 group"
              >

                <span className="text-white/90 text-lg tracking-[2px] uppercase font-light group-hover:text-[#D4AF37] transition duration-300">

                  {item.title}

                </span>

                <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition duration-300">

                  →

                </span>

              </Link>

            ))}

          </div>

          {/* PAGES */}
          <div className="px-8 pt-8 pb-6">

            <p className="text-gray-500 text-[10px] tracking-[4px] uppercase mb-4">

              Menu

            </p>

            {pages.map((item) => (

              <Link
                key={item.title}
                href={item.href}
                onClick={close}
                className="flex items-center justify-between py-3 group"
              >

                <span className="text-gray-400 text-sm tracking-[2px] uppercase group-hover:text-white transition duration-300">

                  {item.title}

                </span>

              </Link>

            ))}

          </div>

        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-white/10 shrink-0">

          <p className="text-gray-500 text-xs leading-6">

            Discover fragrances that
            define your presence.

          </p>

          <div className="flex items-center gap-2 mt-3">

            <span className="w-6 h-[1px] bg-[#D4AF37]" />

            <span className="text-[#D4AF37] text-[10px] tracking-[3px] uppercase">

              ANAMYST

            </span>

          </div>

        </div>

      </div>

    </>

  );

}
