"use client";

import { useParams } from "next/navigation";
import { products } from "../../../data/products";
import { addToCart } from "../../../lib/cart";
import Image from "next/image";
import { useState } from "react";

export default function ProductPage() {

  const params = useParams();

  const product = products.find(
    (p) => p.id === Number(params.id)
  );

  const [qty, setQty] = useState(1);

  if (!product) {

    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Product not found
      </div>
    );

  }

  return (

    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

        {/* IMAGE SECTION */}
        <div className="w-full">

          <div className="relative w-full h-[340px] sm:h-[420px] md:h-[520px] bg-white rounded-3xl overflow-hidden shadow-xl">

            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-contain p-4"
            />

            <span className="absolute top-4 left-4 bg-black text-white text-xs px-4 py-2 rounded-full z-10">
              {product.tag}
            </span>

            <span className="absolute top-4 right-4 bg-[#D4AF37] text-black text-xs font-semibold px-4 py-2 rounded-full z-10">
              {product.badge}
            </span>

          </div>

        </div>

        {/* DETAILS SECTION */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {product.name}
          </h1>

          <p className="text-gray-600 text-lg mb-4">
            Premium Luxury Fragrance Collection
          </p>

          {/* RATING */}
          <div className="flex items-center justify-between mb-5">

            <div className="flex items-center gap-3">

              <div className="text-yellow-500 text-xl">
                ★★★★★
              </div>

              <span className="text-gray-600 text-lg">
                {product.rating} ({product.reviews} reviews)
              </span>

            </div>

            <span className="text-green-600 font-semibold">
              In Stock
            </span>

          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {product.description}
          </p>

          {/* NOTES */}
          <div className="mb-8">

            <h3 className="text-2xl font-semibold mb-4">
              Fragrance Notes
            </h3>

            <div className="flex flex-wrap gap-3">

              {product.notesTags.map((note, index) => (

                <span
                  key={index}
                  className="bg-gray-100 px-4 py-2 rounded-full text-sm"
                >
                  {note}
                </span>

              ))}

            </div>

          </div>

          {/* PRICE */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">

            <div className="flex items-center gap-4 flex-wrap">

              <span className="text-5xl font-bold">
                ₹{product.price}
              </span>

              <span className="text-3xl text-gray-400 line-through">
                ₹{product.oldPrice}
              </span>

            </div>

            <span className="text-green-600 text-2xl font-semibold">
              Save ₹{product.oldPrice - product.price}
            </span>

          </div>

          {/* SHIPPING */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-8 border">

            <div className="space-y-3 text-gray-700">

              <p>🚚 Shipping Across India • T&C Apply</p>

              <p>🔒 Secure Checkout</p>

              <p>💯 Authentic Luxury Fragrance</p>

              <p>📦 Easy WhatsApp Support</p>

            </div>

          </div>

          {/* QUANTITY */}
          <div className="flex items-center gap-5 mb-8">

            <div className="flex items-center bg-gray-100 rounded-2xl overflow-hidden">

              <button
                onClick={() =>
                  setQty(qty > 1 ? qty - 1 : 1)
                }
                className="px-5 py-3 text-2xl"
              >
                -
              </button>

              <span className="px-6 text-xl font-semibold">
                {qty}
              </span>

              <button
                onClick={() => setQty(qty + 1)}
                className="px-5 py-3 text-2xl"
              >
                +
              </button>

            </div>

            <span className="text-gray-500 text-lg">
              Quantity
            </span>

          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4">

            <button
              onClick={() => {

                for (let i = 0; i < qty; i++) {
                  addToCart(product);
                }

                alert("Added to cart ✅");

              }}
              className="flex-1 bg-black text-white py-4 rounded-2xl text-lg font-medium hover:bg-[#D4AF37] hover:text-black transition"
            >
              Add to Cart
            </button>

            <button
              className="flex-1 border-2 border-black py-4 rounded-2xl text-lg font-medium hover:bg-black hover:text-white transition"
            >
              Buy Now
            </button>

          </div>

        </div>

      </div>

    </div>

  );
}