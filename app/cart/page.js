"use client";

import { useEffect, useState } from "react";
import { getCart, updateQty, removeItem } from "../../lib/cart";
import Link from "next/link";
import { products } from "../../data/products";
import ProductCard from "../../components/ProductCard";
import Image from "next/image";

export default function CartPage() {

  const [cart, setCart] = useState([]);

  const loadCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    loadCart();
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (

    <div className="bg-gradient-to-b from-[#f8f8f8] to-[#ececec] min-h-screen p-4 md:p-10">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-10 text-black">
        Your Cart
      </h1>

      {cart.length === 0 ? (

        <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

          <h2 className="text-3xl font-bold mb-4 text-black">
            Your cart is empty 😔
          </h2>

          <p className="text-gray-500 mb-8">
            Explore premium fragrances from ANAMYST
          </p>

          <Link href="/shop">

            <button className="bg-black text-white px-8 py-4 rounded-2xl hover:bg-[#D4AF37] hover:text-black transition duration-300">

              Continue Shopping

            </button>

          </Link>

        </div>

      ) : (

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">

            {cart.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden"
              >

                <div className="flex flex-col md:flex-row">

                  {/* IMAGE */}
                  <div className="relative md:w-[320px] h-[320px] overflow-hidden">

                    <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    priority
                    loading="eager"
                    sizes="(max-width:768px) 100vw, 320px"
                    className="object-cover hover:scale-105 transition duration-500"
                  />

                    {/* TAG */}
                    <span className="absolute top-4 left-4 bg-black text-white text-xs px-4 py-2 rounded-full z-10">
                      {item.tag || "Best Seller"}
                    </span>

                    {/* BADGE */}
                    <span className="absolute top-4 right-4 bg-[#D4AF37] text-black text-xs font-semibold px-4 py-2 rounded-full z-10">
                      {item.badge || "Premium"}
                    </span>

                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 p-6 flex flex-col justify-between">

                    <div>

                      {/* NAME */}
                      <h2 className="text-3xl font-bold text-black mb-3">
                        {item.name}
                      </h2>

                      {/* DESC */}
                      <p className="text-gray-600 text-lg">
                        Premium Luxury Fragrance
                      </p>

                      {/* NOTES */}
                      <div className="flex flex-wrap gap-3 mt-5">

                        {item.notesTags?.map((note, index) => (

                          <span
                            key={index}
                            className="
                              bg-gradient-to-r
                              from-black
                              to-[#1a1a1a]
                              text-[#D4AF37]
                              border border-[#D4AF37]/30
                              px-4 py-2
                              rounded-full
                              text-xs
                              font-semibold
                              tracking-wide
                              shadow-md
                            "
                          >
                            {note}
                          </span>

                        ))}

                      </div>

                      {/* RATINGS */}
                      <div className="flex items-center gap-3 mt-5">

                        <span className="text-yellow-500 text-lg">
                          ★★★★★
                        </span>

                        <span className="text-gray-600">
                          {item.rating || 4.8} ({item.reviews || 120} reviews)
                        </span>

                      </div>

                      {/* PRICE */}
                      <div className="flex items-center gap-4 mt-6 flex-wrap">

                        <p className="text-4xl font-bold text-black">
                          ₹{item.price}
                        </p>

                        <p className="text-gray-400 line-through text-xl">
                          ₹{item.oldPrice || item.price + 500}
                        </p>

                        <span className="text-green-600 font-semibold">
                          In Stock
                        </span>

                      </div>

                      {/* SHIPPING */}
                      <p className="mt-5 text-gray-600">
                        🚚 Shipping Across India • T&C Apply
                      </p>

                    </div>

                    {/* BOTTOM */}
                    <div className="flex items-center justify-between flex-wrap gap-5 mt-8">

                      {/* QUANTITY */}
                      <div className="flex items-center gap-4">

                        <button
                          onClick={() => {

                            if (item.qty === 1) {

                              const confirmDelete = confirm(
                                "Remove this item from cart?"
                              );

                              if (confirmDelete) {
                                removeItem(item.id);
                                loadCart();
                              }

                            } else {

                              updateQty(item.id, -1);
                              loadCart();

                            }

                          }}
                          className="w-12 h-12 rounded-xl bg-black text-white hover:bg-[#D4AF37] hover:text-black transition duration-300 text-xl"
                        >
                          -
                        </button>

                        <span className="text-2xl font-bold text-black">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => {
                            updateQty(item.id, 1);
                            loadCart();
                          }}
                          className="w-12 h-12 rounded-xl bg-black text-white hover:bg-[#D4AF37] hover:text-black transition duration-300 text-xl"
                        >
                          +
                        </button>

                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() => {
                          removeItem(item.id);
                          loadCart();
                        }}
                        className="text-red-500 font-semibold hover:text-red-700 transition duration-300"
                      >
                        Remove
                      </button>

                      {/* TOTAL */}
                      <div className="text-right">

                        <p className="text-gray-500">
                          Total
                        </p>

                        <p className="text-3xl font-bold text-black">
                          ₹{item.price * item.qty}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* RIGHT SIDE */}
          <div>

            <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-24">

              <h2 className="text-3xl font-bold mb-8 text-black">
                Price Details
              </h2>

              <div className="space-y-5">

                <div className="flex justify-between text-gray-700 text-lg">

                  <span>Total Items</span>

                  <span>
                    {cart.reduce((sum, i) => sum + i.qty, 0)}
                  </span>

                </div>

                <div className="flex justify-between text-gray-700 text-lg">

                  <span>Total Price</span>

                  <span>₹{total}</span>

                </div>

                <div className="flex justify-between text-gray-700 text-lg">

                  <span>Shipping</span>

                  <span className="text-green-600">
                    Calculated at Checkout
                  </span>

                </div>

              </div>

              <hr className="my-8" />

              <div className="flex justify-between items-center mb-8">

                <span className="text-2xl font-bold text-black">
                  Total
                </span>

                <span className="text-4xl font-bold text-black">
                  ₹{total}
                </span>

              </div>

              {/* CHECKOUT */}
              <Link href="/checkout">

                <button className="w-full bg-black text-white py-4 rounded-2xl hover:bg-[#D4AF37] hover:text-black transition duration-300 text-lg font-semibold">

                  Proceed to Checkout

                </button>

              </Link>

              {/* TRUST */}
              <div className="mt-8 space-y-4 text-gray-600">

                <p>🚚 Shipping Across India • T&C Apply</p>

                <p>🔒 Secure Checkout</p>

                <p>💯 Premium Long Lasting Fragrance</p>

                <p>📦 Easy WhatsApp Support</p>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* SUGGESTIONS */}
      <div className="mt-24">

        <h2 className="text-4xl font-bold mb-10 text-black">
          You may also like
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {products.slice(0, 4).map((product) => (

            <ProductCard
              key={product.id}
              product={product}
            />

          ))}

        </div>

      </div>

    </div>

  );

}