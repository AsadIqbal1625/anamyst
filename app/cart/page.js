"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import Image from "next/image";

import ProductCard
from "../../components/ProductCard";

import {
  getCart,
  updateQuantity,
  removeFromCart,
} from "../../lib/cart";

export default function CartPage() {

  const [mounted,
    setMounted] =
    useState(false);

  const [cart,
    setCart] =
    useState([]);

  const [products,
    setProducts] =
    useState([]);

  /* REMOVE CONFIRMATION */

  const [confirmItem,
    setConfirmItem] =
    useState(null);

  /* HYDRATION FIX */

  useEffect(() => {

    setMounted(true);

  }, []);

  /* LOAD CART */

  const loadCart = () => {

    const cartData =
      getCart();

    setCart(cartData);

  };

  /* LOAD PRODUCTS */

  async function loadProducts() {

    try {

      const res =
        await fetch(
          "/api/products"
        );

      const data =
        await res.json();

      if (data.success) {

        setProducts(
          data.products
        );

      }

    } catch (error) {

      console.log(error);

    }

  }

  useEffect(() => {

    if (!mounted) return;

    loadCart();

    loadProducts();

  }, [mounted]);

  /* SAFE TOTAL */

  const total = useMemo(() => {

    return cart.reduce(

      (sum, item) => {

        const price =
          Number(item.price) || 0;

        const quantity =
          Number(item.quantity) || 1;

        return (
          sum +
          price * quantity
        );

      },

      0

    );

  }, [cart]);

  if (!mounted) return null;

  return (

    <div className="min-h-screen bg-black text-white">

      {/* REMOVE CONFIRMATION MODAL */}
      {confirmItem && (

        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center px-6 bg-black/70 backdrop-blur-sm"
          onClick={() =>
            setConfirmItem(null)
          }
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="w-full max-w-sm bg-black border border-[#D4AF37]/30 rounded-[28px] p-8 text-center shadow-[0_0_80px_rgba(0,0,0,0.9)]"
          >

            <p className="uppercase tracking-[4px] text-[#D4AF37] text-[10px] mb-4">

              Remove Item

            </p>

            <h3 className="text-xl font-semibold mb-2">

              {confirmItem.name}

            </h3>

            <p className="text-gray-400 text-sm mb-8">

              Are you sure you want to remove
              this item from your cart?

            </p>

            <div className="grid grid-cols-2 gap-4">

              <button
                onClick={() =>
                  setConfirmItem(null)
                }
                className="py-3 rounded-xl border border-white/20 text-white hover:border-[#D4AF37] transition"
              >

                Keep It

              </button>

              <button
                onClick={() => {

                  removeFromCart(
                    confirmItem._id
                  );

                  loadCart();

                  setConfirmItem(null);

                }}
                className="py-3 rounded-xl bg-red-500/90 text-white font-semibold hover:bg-red-500 transition"
              >

                Remove

              </button>

            </div>

          </div>

        </div>

      )}

      {/* HERO */}

      <section className="relative px-6 py-8">

        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent" />

        <div className="relative max-w-5xl mx-auto text-center">

          <p className="uppercase tracking-[5px] text-[#D4AF37] text-xs mb-3">

            ANAMYST Checkout

          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">

            Your Cart

          </h1>

          <p className="text-gray-400 max-w-xl mx-auto">

            Review your luxury fragrance collection before checkout.

          </p>

        </div>

      </section>

      {/* EMPTY CART */}

      {cart.length === 0 ? (

        <section className="px-6 py-12">

          <div className="max-w-md mx-auto bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-3xl p-10 text-center">

            <div className="w-20 h-20 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-6">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-[#D4AF37]"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386a1.5 1.5 0 011.415 1.03L5.76 6.75m0 0L7.5 14.25h9.75l1.74-7.5H5.76zm0 0L5.25 4.5M9 18.75a.75.75 0 100 1.5.75.75 0 000-1.5zm9 0a.75.75 0 100 1.5.75.75 0 000-1.5z"
                />

              </svg>

            </div>

            <h2 className="text-3xl font-bold mb-4">

              Your Cart is Empty

            </h2>

            <p className="text-gray-400 mb-8 leading-relaxed">

              Discover signature luxury fragrances crafted for elegance and timeless identity.

            </p>

            <Link href="/shop">

              <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-2xl hover:opacity-90 transition duration-300 font-semibold">

                Explore Collection

              </button>

            </Link>

          </div>

        </section>

      ) : (

        <section className="px-4 md:px-6 py-8">

          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">

            {/* LEFT */}

            <div className="lg:col-span-2 space-y-5">

              {cart.map(
                (item, index) => {

                  const price =
                    Number(item.price) || 0;

                  const quantity =
                    Number(item.quantity) || 1;

                  return (

                    <div
                      key={`${item._id}-${index}`}
                      className="bg-[#0B0B0B] rounded-3xl overflow-hidden border border-white/10"
                    >

                      <div className="flex flex-col md:flex-row">

                        {/* IMAGE */}

                        <div className="relative md:w-[220px] h-[220px] bg-black">

                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain p-5"
                          />

                        </div>

                        {/* CONTENT */}

                        <div className="flex-1 p-6">

                          <p className="uppercase tracking-[4px] text-[#D4AF37] text-xs mb-3">

                            ANAMYST Luxury

                          </p>

                          <h2 className="text-2xl md:text-3xl font-bold mb-3">

                            {item.name}

                          </h2>

                          <p className="text-gray-400 mb-5">

                            Crafted for timeless elegance.

                          </p>

                          {/* PRICE */}

                          <div className="flex items-center gap-4 mb-7">

                            <p className="text-3xl font-bold">

                              ₹{price}

                            </p>

                            <p className="text-gray-500 line-through">

                              ₹
                              {Number(
                                item.oldPrice
                              ) ||
                                price + 500}

                            </p>

                          </div>

                          {/* ACTIONS */}

                          <div className="flex flex-wrap items-center justify-between gap-5">

                            {/* QUANTITY */}

                            <div className="flex items-center gap-3">

                              <button
                                onClick={() => {

                                  if (
                                    quantity === 1
                                  ) {

                                    /* last piece → ask first */
                                    setConfirmItem(item);

                                  } else {

                                    updateQuantity(
                                      item._id,
                                      "decrease"
                                    );

                                    loadCart();

                                  }

                                }}
                                className="w-10 h-10 rounded-xl bg-black border border-white/10 hover:bg-[#D4AF37] hover:text-black transition"
                              >

                                -

                              </button>

                              <span className="text-lg font-semibold">

                                {quantity}

                              </span>

                              <button
                                onClick={() => {

                                  updateQuantity(
                                    item._id,
                                    "increase"
                                  );

                                  loadCart();

                                }}
                                className="w-10 h-10 rounded-xl bg-black border border-white/10 hover:bg-[#D4AF37] hover:text-black transition"
                              >

                                +

                              </button>

                            </div>

                            {/* REMOVE */}

                            <button
                              onClick={() =>
                                setConfirmItem(item)
                              }
                              className="text-red-400 hover:text-red-300 transition text-sm"
                            >

                              Remove

                            </button>

                            {/* TOTAL */}

                            <div className="text-right">

                              <p className="text-gray-500 text-sm">

                                Total

                              </p>

                              <p className="text-2xl font-bold">

                                ₹
                                {price *
                                  quantity}

                              </p>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

            {/* RIGHT */}

            <div>

              <div className="bg-[#0B0B0B] rounded-3xl p-7 sticky top-24 border border-white/10">

                <h2 className="text-2xl font-bold mb-7">

                  Order Summary

                </h2>

                <div className="space-y-4">

                  <div className="flex justify-between text-gray-300">

                    <span>Total Items</span>

                    <span>

                      {cart.reduce(

                        (sum, i) =>

                          sum +
                          (Number(
                            i.quantity
                          ) || 1),

                        0

                      )}

                    </span>

                  </div>

                  <div className="flex justify-between text-gray-300">

                    <span>Total Price</span>

                    <span>

                      ₹{total}

                    </span>

                  </div>

                  <div className="flex justify-between text-gray-300">

                    <span>Shipping</span>

                    <span className="text-green-400">

                      Free

                    </span>

                  </div>

                </div>

                <div className="border-t border-white/10 my-7" />

                <div className="flex justify-between items-center mb-7">

                  <span className="text-xl font-semibold">

                    Total

                  </span>

                  <span className="text-3xl font-bold text-[#D4AF37]">

                    ₹{total}

                  </span>

                </div>

                <div className="bg-black rounded-2xl p-5 mb-7 space-y-3 text-gray-400 text-sm">

                  <p>

                    🚚 Shipping Across India

                  </p>

                  <p>

                    🔒 Secure Checkout

                  </p>

                  <p>

                    ✨ Authentic Luxury Fragrances

                  </p>

                </div>

                <Link href="/checkout">

                  <button className="w-full bg-[#D4AF37] text-black py-4 rounded-2xl hover:opacity-90 transition font-semibold">

                    Proceed to Checkout

                  </button>

                </Link>

              </div>

            </div>

          </div>

        </section>

      )}

      {/* SUGGESTIONS */}

      <section className="px-6 pb-20 pt-8">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl font-bold mb-8 text-center">

            You May Also Like

          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {products
              .slice(0, 4)
              .map((product) => (

                <ProductCard
                  key={product._id}
                  product={product}
                />

              ))}

          </div>

        </div>

      </section>

    </div>

  );

}