"use client";

import Link from "next/link";
import Image from "next/image";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import { getCart }
from "../lib/cart";

import {
  useRouter,
} from "next/navigation";

import MobileMenu
from "./MobileMenu";

import PromoBar
from "./PromoBar";

export default function Navbar({ initialCoupon = null }) {

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

  /* SMART NAVBAR (hide on scroll down, show on scroll up) */

  const navRef = useRef(null);

  const [hidden, setHidden] =
    useState(false);

  const [navHeight, setNavHeight] =
    useState(0);

  useEffect(() => {

    const measure = () =>
      setNavHeight(
        navRef.current?.offsetHeight || 0
      );

    measure();

    window.addEventListener(
      "resize",
      measure
    );

    /* re-measure when navbar content changes (e.g. promo bar loads) */

    const observer =
      new ResizeObserver(measure);

    if (navRef.current) {
      observer.observe(navRef.current);
    }

    let lastY = window.scrollY;

    const onScroll = () => {

      const y = window.scrollY;

      if (y < 80 || y < lastY - 2) {

        /* near top OR scrolling up → show */
        setHidden(false);

      } else if (y > lastY + 2) {

        /* scrolling down → hide */
        setHidden(true);

      }

      lastY = y;

    };

    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true }
    );

    return () => {

      window.removeEventListener(
        "resize",
        measure
      );

      window.removeEventListener(
        "scroll",
        onScroll
      );

      observer.disconnect();

    };

  }, []);

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

      {/* SPACER (keeps page content below the fixed navbar) */}
      <div style={{ height: navHeight }} />

      {/* NAVBAR */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-30 bg-black/95 backdrop-blur-xl border-b border-white/10 w-full transition-transform duration-300 ${
          hidden
            ? "-translate-y-full"
            : "translate-y-0"
        }`}
      >

        {/* PROMO BAR */}
        <PromoBar initialCoupon={initialCoupon} />

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
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-lg object-cover"
                />

                <h1 className="font-brand text-white text-2xl sm:text-4xl tracking-[0.2em]">

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
                <div className="absolute top-full left-0 pt-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">

                  <div className="w-[400px] bg-black/95 backdrop-blur-2xl border border-[#D4AF37]/20 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden">

                    {/* HEADER */}
                    <div className="px-7 pt-6 pb-4 border-b border-white/5">

                      <p className="text-[10px] tracking-[5px] text-[#D4AF37] uppercase">

                        The Collections

                      </p>

                    </div>

                    {/* ITEMS */}
                    <div className="py-2">

                      {[
                        {
                          href: "/shop/perfumes",
                          name: "Perfumes",
                          desc: "Signature luxury fragrances",
                        },
                        {
                          href: "/shop/attars",
                          name: "Attars",
                          desc: "Traditional premium attars",
                        },
                        {
                          href: "/shop/fresheners",
                          name: "Fresheners",
                          desc: "Refresh your surroundings",
                        },
                        {
                          href: "/shop/premium-gifts",
                          name: "Premium Gifts",
                          desc: "Elegant gifting collections",
                        },
                        {
                          href: "/shop/combos",
                          name: "Combos",
                          desc: "Curated fragrance bundles",
                        },
                      ].map((item) => (

                        <Link
                          key={item.href}
                          href={item.href}
                          className="group/item flex items-center justify-between px-7 py-4 hover:bg-[#D4AF37]/5 transition duration-300"
                        >

                          <div>

                            <p className="text-white text-sm tracking-[3px] uppercase font-medium group-hover/item:text-[#D4AF37] transition duration-300">

                              {item.name}

                            </p>

                            <p className="text-gray-500 text-xs mt-1 normal-case tracking-normal">

                              {item.desc}

                            </p>

                          </div>

                          <span className="text-[#D4AF37] opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300">

                            →

                          </span>

                        </Link>

                      ))}

                    </div>

                    {/* FOOTER — ALL COLLECTIONS */}
                    <Link
                      href="/shop"
                      className="block px-7 py-5 border-t border-white/5 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 transition duration-300"
                    >

                      <span className="text-[#D4AF37] text-xs tracking-[4px] uppercase font-semibold">

                        View All Collections →

                      </span>

                    </Link>

                  </div>

                </div>

              </div>

              {/* NOTICES */}
              <Link
                href="/notices"
                className="hover:text-[#D4AF37] transition duration-300"
              >

                New Launches

              </Link>

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
              <Link
                href="/track-order"
                className="hover:text-[#D4AF37] transition"
              >
                Track Order
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