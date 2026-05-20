"use client";

import {
  useEffect,
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

  const [cart, setCart] =
    useState([]);

  const [products,
    setProducts] =
    useState([]);

  /* LOAD CART */
  const loadCart = () => {

    setCart(getCart());

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

    loadCart();

    loadProducts();

  }, []);

  /* TOTAL */
  const total = cart.reduce(

    (sum, item) =>

      sum +
      item.price *
        item.quantity,

    0

  );

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* HERO */}
      <section className="relative px-6 py-16 border-b border-[#D4AF37]/20">

        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent" />

        <div className="relative max-w-6xl mx-auto text-center">

          <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-5">

            ANAMYST Checkout

          </p>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">

            Your Cart

          </h1>

          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-8">

            Review your luxury fragrance
            collection before checkout.

          </p>

        </div>

      </section>

      {/* EMPTY */}
      {cart.length === 0 ? (

        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">

          <h2 className="text-4xl font-bold mb-5">

            Your cart is empty

          </h2>

          <p className="text-gray-400 mb-10 max-w-xl leading-8">

            Explore premium fragrances
            from ANAMYST.

          </p>

          <Link href="/shop">

            <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-2xl hover:opacity-90 transition duration-300 font-semibold">

              Continue Shopping

            </button>

          </Link>

        </div>

      ) : (

        <section className="px-4 md:px-6 py-14">

          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">

            {/* LEFT */}
            <div className="lg:col-span-2 space-y-8">

              {cart.map(
                (item, index) => (

                  <div
                    key={`${item._id}-${index}`}
                    className="bg-white/5 border border-white/10 rounded-[36px] overflow-hidden backdrop-blur-xl"
                  >

                    <div className="flex flex-col md:flex-row">

                      {/* IMAGE */}
                      <div className="relative md:w-[320px] h-[320px] overflow-hidden bg-black/40">

                        <Image
                          src={item.image}
                          alt={item.name}
                        
                          priority
                          sizes="(max-width:768px) 100vw, 320px"
                          className="object-contain hover:scale-105 transition duration-700"
                        />

                        <span className="absolute top-4 left-4 bg-black text-white text-xs px-4 py-2 rounded-full z-10 border border-white/10">

                          {item.tag ||
                            "Best Seller"}

                        </span>

                        <span className="absolute top-4 right-4 bg-[#D4AF37] text-black text-xs font-semibold px-4 py-2 rounded-full z-10">

                          {item.badge ||
                            "Premium"}

                        </span>

                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 p-6 flex flex-col justify-between">

                        <div>

                          <p className="uppercase tracking-[5px] text-[#D4AF37] text-xs mb-4">

                            ANAMYST Luxury

                          </p>

                          <h2 className="text-4xl font-bold text-white mb-4">

                            {item.name}

                          </h2>

                          <p className="text-gray-400 text-lg">

                            Premium Luxury Fragrance

                          </p>

                          {/* NOTES */}
                          <div className="flex flex-wrap gap-3 mt-6">

                            {item.notesTags?.map(
                              (
                                note,
                                noteIndex
                              ) => (

                                <span
                                  key={`${note}-${noteIndex}`}
                                  className="bg-black text-[#D4AF37] border border-[#D4AF37]/30 px-4 py-2 rounded-full text-xs font-semibold tracking-wide"
                                >

                                  {note}

                                </span>

                              )
                            )}

                          </div>

                          {/* RATING */}
                          <div className="flex items-center gap-3 mt-6">

                            <span className="text-[#D4AF37] text-lg">

                              ★★★★★

                            </span>

                            <span className="text-gray-400">

                              {item.rating ||
                                4.8}

                              {" "}
                              (
                              {item.reviews ||
                                120}
                              {" "}
                              reviews)

                            </span>

                          </div>

                          {/* PRICE */}
                          <div className="flex items-center gap-4 mt-6 flex-wrap">

                            <p className="text-4xl font-bold text-white">

                              ₹{item.price}

                            </p>

                            <p className="text-gray-500 line-through text-xl">

                              ₹
                              {item.oldPrice ||
                                item.price +
                                  500}

                            </p>

                            <span className="text-green-400 font-semibold">

                              In Stock

                            </span>

                          </div>

                          <p className="mt-5 text-gray-400">

                            🚚 Shipping Across India

                          </p>

                        </div>

                        {/* BOTTOM */}
                        <div className="flex items-center justify-between flex-wrap gap-5 mt-10">

                          {/* QUANTITY */}
                          <div className="flex items-center gap-4">

                            {/* DECREASE */}
                            <button
                              onClick={() => {

                                if (
                                  item.quantity === 1
                                ) {

                                  const confirmDelete =
                                    confirm(
                                      "Remove this item from cart?"
                                    );

                                  if (
                                    confirmDelete
                                  ) {

                                    removeFromCart(
                                      item._id
                                    );

                                    loadCart();

                                  }

                                } else {

                                  updateQuantity(
                                    item._id,
                                    "decrease"
                                  );

                                  loadCart();

                                }

                              }}
                              className="w-12 h-12 rounded-2xl bg-black border border-white/10 text-white hover:bg-[#D4AF37] hover:text-black transition duration-300 text-xl"
                            >

                              -

                            </button>

                            <span className="text-2xl font-bold text-white">

                              {item.quantity}

                            </span>

                            {/* INCREASE */}
                            <button
                              onClick={() => {

                                updateQuantity(
                                  item._id,
                                  "increase"
                                );

                                loadCart();

                              }}
                              className="w-12 h-12 rounded-2xl bg-black border border-white/10 text-white hover:bg-[#D4AF37] hover:text-black transition duration-300 text-xl"
                            >

                              +

                            </button>

                          </div>

                          {/* REMOVE */}
                          <button
                            onClick={() => {

                              removeFromCart(
                                item._id
                              );

                              loadCart();

                            }}
                            className="text-red-400 font-semibold hover:text-red-300 transition duration-300"
                          >

                            Remove

                          </button>

                          {/* TOTAL */}
                          <div className="text-right">

                            <p className="text-gray-500">

                              Total

                            </p>

                            <p className="text-3xl font-bold text-white">

                              ₹
                              {item.price *
                                item.quantity}

                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

            {/* RIGHT */}
            <div>

              <div className="bg-white/5 border border-white/10 rounded-[36px] p-8 sticky top-24 backdrop-blur-xl">

                <h2 className="text-3xl font-bold mb-8 text-white">

                  Price Details

                </h2>

                <div className="space-y-5">

                  <div className="flex justify-between text-gray-300 text-lg">

                    <span>Total Items</span>

                    <span>

                      {cart.reduce(

                        (sum, i) =>

                          sum +
                          i.quantity,

                        0

                      )}

                    </span>

                  </div>

                  <div className="flex justify-between text-gray-300 text-lg">

                    <span>Total Price</span>

                    <span>

                      ₹{total}

                    </span>

                  </div>

                  <div className="flex justify-between text-gray-300 text-lg">

                    <span>Shipping</span>

                    <span className="text-green-400">

                      Free

                    </span>

                  </div>

                </div>

                <hr className="my-8 border-white/10" />

                <div className="flex justify-between items-center mb-8">

                  <span className="text-2xl font-bold text-white">

                    Total

                  </span>

                  <span className="text-4xl font-bold text-[#D4AF37]">

                    ₹{total}

                  </span>

                </div>

                {/* FEATURES */}
                <div className="bg-black/40 border border-white/10 rounded-[24px] p-5 mb-8 space-y-4 text-gray-300">

                  <p>

                    🚚 Shipping Across India

                  </p>

                  <p>

                    🔒 Secure Checkout

                  </p>

                  <p>

                    💯 Authentic Luxury Fragrances

                  </p>

                </div>

                <Link href="/checkout">

                  <button className="w-full bg-[#D4AF37] text-black py-5 rounded-2xl hover:opacity-90 transition duration-300 text-lg font-semibold">

                    Proceed to Checkout

                  </button>

                </Link>

              </div>

            </div>

          </div>

        </section>

      )}

      {/* SUGGESTIONS */}
      <section className="px-6 pb-24">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-4xl font-bold mb-12 text-white text-center">

            You May Also Like

          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

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