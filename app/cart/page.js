"use client";

import { useEffect, useState } from "react";
import { getCart, updateQty, removeItem } from "../../lib/cart";
import Link from "next/link";
import { products } from "../../data/products";
import ProductCard from "../../components/ProductCard";

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
    <div className="bg-gradient-to-b from-[#f8f8f8] to-[#ececec] min-h-screen p-6 md:p-10">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-10">
        Your Cart
      </h1>

      {cart.length === 0 ? (

        <div className="bg-white rounded-2xl shadow-md p-10 text-center">

          <h2 className="text-2xl font-semibold mb-3">
            Your cart is empty 😔
          </h2>

          <p className="text-gray-500 mb-6">
            Explore premium fragrances from ANAMYST
          </p>

          <Link href="/shop">
            <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-[#D4AF37] hover:text-black transition">
              Continue Shopping
            </button>
          </Link>

        </div>

      ) : (

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {cart.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 border border-gray-100 overflow-hidden"
              >

                <div className="flex flex-col md:flex-row">

                  {/* IMAGE */}
                  <div className="relative group md:w-[300px] overflow-hidden">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover md:h-[280px] group-hover:scale-105 transition duration-500"
                    />

                    {/* TAGS */}
                    <span className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1 rounded-full">
                      Best Seller
                    </span>

                    <span className="absolute top-4 right-4 bg-[#D4AF37] text-black text-xs font-semibold px-3 py-1 rounded-full">
                      Premium
                    </span>

                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 p-6 flex flex-col justify-between">

                    <div>

                      <h2 className="text-3xl font-bold mb-2">
                        {item.name}
                      </h2>

                      <p className="text-gray-500 mb-4">
                        Premium Luxury Fragrance
                      </p>

                      {/* TAGS */}
                      <div className="flex flex-wrap gap-2 mb-5">

                        <span className="bg-gray-100 text-xs px-3 py-1 rounded-full">
                          Woody
                        </span>

                        <span className="bg-gray-100 text-xs px-3 py-1 rounded-full">
                          Musk
                        </span>

                        <span className="bg-gray-100 text-xs px-3 py-1 rounded-full">
                          Long Lasting
                        </span>

                      </div>

                      {/* RATINGS */}
                      <div className="flex items-center gap-2 mb-5">

                        <div className="text-yellow-500">
                          ★★★★★
                        </div>

                        <span className="text-gray-500 text-sm">
                          4.6 (182 reviews)
                        </span>

                      </div>

                      {/* PRICE */}
                      <div className="flex items-center gap-4 mb-5">

                        <p className="text-3xl font-bold">
                          ₹{item.price}
                        </p>

                        <p className="text-gray-400 line-through">
                          ₹{item.price + 500}
                        </p>

                        <span className="text-green-600 text-sm">
                          In Stock
                        </span>

                      </div>

                      {/* SHIPPING */}
                      <p className="text-gray-500 text-sm mb-6">
                        🚚 Shipping Across India • T&C Apply
                      </p>

                    </div>

                    {/* QUANTITY */}
                    <div className="flex flex-wrap items-center gap-4">

                      <div className="flex items-center gap-3">

                        <button
                          onClick={() => {

                            if (item.qty === 1) {

                              const confirmDelete = confirm(
                                "Do you want to remove this item from cart?"
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
                          className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                        >
                          -
                        </button>

                        <span className="font-semibold text-lg">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => {
                            updateQty(item.id, 1);
                            loadCart();
                          }}
                          className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
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
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        Remove
                      </button>

                      {/* TOTAL */}
                      <div className="ml-auto text-right">

                        <p className="text-sm text-gray-500">
                          Total
                        </p>

                        <p className="text-2xl font-bold">
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

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 sticky top-24">

              <h2 className="text-3xl font-bold mb-8">
                Price Details
              </h2>

              <div className="space-y-4 mb-6">

                <div className="flex justify-between text-gray-700">
                  <span>Total Items</span>
                  <span>
                    {cart.reduce((sum, i) => sum + i.qty, 0)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Total Price</span>
                  <span>₹{total}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600">
                    Calculated at Checkout
                  </span>
                </div>

              </div>

              <hr className="mb-6" />

              <div className="flex justify-between items-center mb-8">

                <span className="text-2xl font-bold">
                  Total
                </span>

                <span className="text-3xl font-bold">
                  ₹{total}
                </span>

              </div>

              {/* CHECKOUT */}
              <Link href="/checkout">

                <button className="w-full bg-black text-white py-4 rounded-xl hover:bg-[#D4AF37] hover:text-black transition duration-300 font-medium text-lg">

                  Proceed to Checkout

                </button>

              </Link>

              {/* TRUST */}
              <div className="mt-8 space-y-3 text-sm text-gray-500">

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
      <div className="mt-20">

        <h2 className="text-4xl font-bold mb-10">
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