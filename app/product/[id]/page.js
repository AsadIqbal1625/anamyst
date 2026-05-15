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

      const relatedProducts = products.filter(
        (p) => p.id !== product.id
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 items-start max-w-5xl mx-auto">

        {/* PRODUCT IMAGE */}

        <div className="bg-white rounded-3xl shadow-lg p-3 md:p-4">

          <div className="relative w-full h-[260px] sm:h-[340px] md:h-[520px] overflow-hidden rounded-2xl bg-[#f8f8f8]">

            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-contain"
            />

            <span className="absolute top-4 left-4 bg-black text-white text-xs px-4 py-2 rounded-full z-10">
              {product.tag}
            </span>

            <span className="absolute top-4 right-4 bg-[#D4AF37] text-black text-xs font-semibold px-4 py-2 rounded-full z-10">
              {product.badge}
            </span>

          </div>

        </div>

        {/* PRODUCT DETAILS */}

        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-5 md:p-6">

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            {product.name}
          </h1>

          <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-4">
            Premium Luxury Fragrance Collection
          </p>

          {/* RATING */}

          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">

            <div className="flex items-center gap-3">

              <div className="text-yellow-500 text-lg">
                ★★★★★
              </div>

              <span className="text-gray-600 text-sm sm:text-base">
                {product.rating} ({product.reviews} reviews)
              </span>

            </div>

            <span className="text-green-600 font-semibold">
              In Stock
            </span>

          </div>

          {/* DESCRIPTION */}

          <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
            {product.description}
          </p>

          {/* NOTES */}

          <div className="mb-6">

            <h3 className="text-xl font-semibold mb-3">
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

          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">

            <div className="flex items-center gap-4 flex-wrap">

              <span className="text-2xl sm:text-3xl font-bold text-black">
                ₹{product.price}
              </span>

              <span className="text-xl text-gray-400 line-through">
                ₹{product.oldPrice}
              </span>

            </div>

            <span className="text-green-600 text-xl font-semibold">
              Save ₹{product.oldPrice - product.price}
            </span>

          </div>

          {/* SHIPPING */}

          <div className="bg-gray-50 rounded-2xl p-3 mb-5 border">

            <div className="space-y-3 text-sm sm:text-base text-gray-700">

              <p>🚚 Shipping Across India • T&C Apply</p>

              <p>🔒 Secure Checkout</p>

              <p>💯 Authentic Luxury Fragrance</p>

              <p>📦 Easy WhatsApp Support</p>

            </div>

          </div>

          {/* QUANTITY */}

          <div className="flex items-center gap-4 mb-6 flex-wrap">

            <div className="flex items-center bg-gray-100 rounded-2xl overflow-hidden">

              <button
                onClick={() =>
                  setQty(qty > 1 ? qty - 1 : 1)
                }
                className="px-4 py-2 text-xl"
              >
                -
              </button>

              <span className="px-4 text-lg font-semibold">
                {qty}
              </span>

              <button
                onClick={() => setQty(qty + 1)}
                className="px-4 py-2 text-xl"
              >
                +
              </button>

            </div>

            <span className="text-gray-500 text-sm sm:text-base">
              Quantity
            </span>

          </div>

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-3">

            <button
              onClick={() => {

                for (let i = 0; i < qty; i++) {
                  addToCart(product);
                }

                alert("Added to cart ✅");

              }}
              className="flex-1 bg-black text-white py-3 rounded-2xl text-base sm:text-lg font-medium hover:bg-[#D4AF37] hover:text-black transition"
            >
              Add to Cart
            </button>

          <button
              onClick={() => {
                addToCart(product);
                window.location.href = "/checkout";
              }}
              className="flex-1 border-2 border-black text-black py-3 rounded-2xl font-semibold hover:bg-black hover:text-white transition"
            >
              Buy Now
            </button>

          </div>

        </div>

      </div>
         {/* RELATED PRODUCTS */}

<div className="mt-16">

  <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
    You May Also Like
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

    {relatedProducts.map((item) => (

      <Link
        key={item.id}
        href={`/product/${item.id}`}
      >

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">

          <div className="relative h-64 overflow-hidden">

            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
            />

          </div>

          <div className="p-5">

            <h3 className="text-xl font-semibold mb-2">
              {item.name}
            </h3>

            <p className="text-gray-500 text-sm mb-3">
              {item.description}
            </p>

            <div className="flex items-center justify-between">

              <span className="text-2xl font-bold">
                ₹{item.price}
              </span>

              <span className="text-green-600 font-medium">
                In Stock
              </span>

            </div>

          </div>

        </div>

      </Link>

    ))}

  </div>

    </div>       
    </div>

  );
}