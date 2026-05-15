"use client";

import { useParams } from "next/navigation";
import { products } from "../../../data/products";
import { addToCart } from "../../../lib/cart";
import { useState } from "react";

export default function ProductPage() {

  const params = useParams();

  const product = products.find(
    (p) => p.id.toString() === params.id
  );

  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="p-10 text-center">
        Product not found
      </div>
    );
  }

  return (

    <div className="bg-[#f8f8f8] min-h-screen py-4 lg:py-10">

      <div className="max-w-6xl mx-auto px-4">

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 p-4 lg:p-10 items-start">

            {/* IMAGE SECTION */}
            <div className="flex justify-center">

              <div className="relative w-full max-w-[320px] lg:max-w-[500px]">

                {/* TAGS */}
                <div className="absolute top-3 left-3 z-20 flex gap-2">

                  <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                    {product.tag}
                  </span>

                  <span className="bg-[#D4AF37] text-black text-xs font-semibold px-3 py-1 rounded-full">
                    {product.badge}
                  </span>

                </div>

                {/* IMAGE */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto object-contain rounded-3xl"
                />

              </div>

            </div>

            {/* CONTENT */}
            <div className="flex flex-col justify-start">

              {/* TITLE */}
              <h1 className="text-3xl lg:text-5xl font-bold leading-tight mb-3">

                {product.name}

              </h1>

              {/* DESCRIPTION */}
              <p className="text-gray-600 text-base lg:text-lg mb-4">

                Premium Luxury Fragrance Collection

              </p>

              {/* RATINGS */}
              <div className="flex items-center gap-3 mb-5 flex-wrap">

                <div className="text-yellow-500 text-xl">
                  ★★★★★
                </div>

                <span className="text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>

                <span className="text-green-600 font-medium">
                  In Stock
                </span>

              </div>

              {/* NOTES */}
              <p className="text-gray-700 mb-5 text-base lg:text-lg">

                Luxury oud fragrance for men

              </p>

              <h3 className="font-semibold text-2xl mb-4">

                Fragrance Notes

              </h3>

              <div className="flex flex-wrap gap-3 mb-8">

                <span className="bg-gray-100 px-4 py-2 rounded-full">
                  Citrus
                </span>

                <span className="bg-gray-100 px-4 py-2 rounded-full">
                  Rose
                </span>

                <span className="bg-gray-100 px-4 py-2 rounded-full">
                  Oud
                </span>

                <span className="bg-gray-100 px-4 py-2 rounded-full">
                  Musk
                </span>

                <span className="bg-gray-100 px-4 py-2 rounded-full">
                  Long Lasting
                </span>

              </div>

              {/* PRICE */}
              <div className="flex items-center gap-4 mb-8 flex-wrap">

                <h2 className="text-4xl lg:text-6xl font-bold">

                  ₹{product.price}

                </h2>

                <span className="text-2xl text-gray-400 line-through">

                  ₹{product.oldPrice}

                </span>

                <span className="text-green-600 text-xl font-semibold">

                  Save ₹500

                </span>

              </div>

              {/* FEATURES */}
              <div className="bg-[#fafafa] border rounded-2xl p-5 mb-8">

                <div className="space-y-4 text-gray-700 text-base">

                  <p>🚚 Shipping Across India • T&C Apply</p>

                  <p>🔒 Secure Checkout</p>

                  <p>💯 Authentic Luxury Fragrance</p>

                  <p>📦 Easy WhatsApp Support</p>

                </div>

              </div>

              {/* QUANTITY */}
              <div className="flex items-center gap-4 mb-8">

                <div className="flex items-center bg-[#f4f4f4] rounded-2xl overflow-hidden">

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
                    onClick={() =>
                      setQty(qty + 1)
                    }
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
              <div className="flex flex-col gap-4">

                <button
                  onClick={() => {

                    for (let i = 0; i < qty; i++) {
                      addToCart(product);
                    }

                    alert("Added to cart ✅");

                  }}
                  className="w-full bg-black text-white py-4 rounded-2xl text-lg hover:bg-[#D4AF37] hover:text-black transition"
                >

                  Add to Cart

                </button>

                <button
                  className="w-full border-2 border-black text-black py-4 rounded-2xl text-lg hover:bg-black hover:text-white transition"
                >

                  Buy Now

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}