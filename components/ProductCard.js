"use client";

import { useParams } from "next/navigation";
import { products } from "../data/products";
import { addToCart } from "../lib/cart";
import Image from "next/image";
import { useState } from "react";

export default function ProductPage() {

  const params = useParams();

  const [qty, setQty] = useState(1);

  const product = products.find(
    (p) => p.id.toString() === params.id
  );

  if (!product) {

    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Product not found
      </div>
    );

  }

  return (

    <div className="bg-[#f6f6f6] min-h-screen px-3 sm:px-6 py-4">

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">

        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* IMAGE SIDE */}
          <div className="relative bg-[#fafafa] p-4 sm:p-6 flex items-center justify-center">

            <div className="relative w-full max-w-sm">

              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={600}
                priority
                className="w-full h-auto object-contain rounded-3xl"
              />

              {/* TAG */}
              <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">
                {product.tag}
              </span>

              {/* BADGE */}
              <span className="absolute top-3 right-3 bg-[#D4AF37] text-black text-xs font-semibold px-3 py-1 rounded-full">
                {product.badge}
              </span>

            </div>

          </div>

          {/* DETAILS SIDE */}
          <div className="p-5 sm:p-8 flex flex-col justify-center">

            {/* TITLE */}
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-2">
              {product.name}
            </h1>

            {/* SUBTEXT */}
            <p className="text-gray-500 text-base mb-4">
              Premium Luxury Fragrance Collection
            </p>

            {/* RATING */}
            <div className="flex items-center gap-2 mb-4">

              <div className="text-yellow-500 text-base">
                ★★★★★
              </div>

              <span className="text-gray-600 text-sm">
                {product.rating} ({product.reviews} reviews)
              </span>

              <span className="text-green-600 text-sm font-medium ml-auto">
                In Stock
              </span>

            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-700 text-base leading-relaxed mb-5">
              Luxury oud fragrance for men
            </p>

            {/* NOTES */}
            <div className="mb-5">

              <h3 className="font-semibold text-xl mb-3">
                Fragrance Notes
              </h3>

              <div className="flex flex-wrap gap-2">

                {["Citrus", "Rose", "Oud", "Musk", "Long Lasting"].map((note) => (

                  <span
                    key={note}
                    className="bg-gray-100 px-4 py-2 rounded-full text-sm"
                  >
                    {note}
                  </span>

                ))}

              </div>

            </div>

            {/* PRICE */}
            <div className="flex items-center gap-4 mb-5 flex-wrap">

              <h2 className="text-5xl font-bold">
                ₹{product.price}
              </h2>

              <span className="line-through text-gray-400 text-2xl">
                ₹{product.oldPrice}
              </span>

              <span className="text-green-600 font-semibold text-lg">
                Save ₹{product.oldPrice - product.price}
              </span>

            </div>

            {/* FEATURES */}
            <div className="bg-[#fafafa] border rounded-2xl p-4 mb-5 text-gray-700 space-y-2 text-sm">

              <p>🚚 Shipping Across India • T&C Apply</p>
              <p>🔒 Secure Checkout</p>
              <p>💯 Authentic Luxury Fragrance</p>
              <p>📦 Easy WhatsApp Support</p>

            </div>

            {/* QUANTITY */}
            <div className="flex items-center gap-4 mb-6">

              <div className="flex items-center border rounded-2xl overflow-hidden">

                <button
                  onClick={() => qty > 1 && setQty(qty - 1)}
                  className="px-4 py-3 text-xl font-semibold bg-gray-100"
                >
                  -
                </button>

                <span className="px-6 text-xl font-semibold">
                  {qty}
                </span>

                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-4 py-3 text-xl font-semibold bg-gray-100"
                >
                  +
                </button>

              </div>

              <span className="text-gray-500">
                Quantity
              </span>

            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4">

              <button
                onClick={() => {
                  addToCart({
                    ...product,
                    qty,
                  });

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

    </div>
  );
}