"use client";

import Link from "next/link";
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
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold text-black">
        Product not found
      </div>
    );

  }

  const relatedProducts = products.filter(
    (p) => p.id !== product.id
  );

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-[#faf7f2] to-[#f3f3f3] px-4 py-6 md:py-10">

      {/* MAIN PRODUCT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-start max-w-6xl mx-auto">

        {/* PRODUCT IMAGE */}
        <div className="bg-white rounded-3xl shadow-lg p-3 md:p-4">

          <div className="flex items-center justify-center bg-[#f8f8f8] rounded-2xl overflow-hidden relative">

            <Image
              src={product.image}
              alt={product.name}
              width={700}
              height={700}
              priority
              className="w-full h-[260px] sm:h-[340px] md:h-[520px] object-contain transition-transform duration-700 hover:scale-105"
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
        <div className="bg-white rounded-3xl shadow-lg p-5 md:p-7">

          <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
            {product.name}
          </h1>

          <p className="text-gray-600 text-lg mb-5">
            Premium Luxury Fragrance Collection
          </p>

          {/* RATING */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">

            <div className="flex items-center gap-3">

              <span className="text-yellow-500 text-xl">
                ★★★★★
              </span>

              <span className="text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>

            </div>

            <span className="text-green-600 font-semibold">
              In Stock
            </span>

          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-700 leading-relaxed mb-6">
            {product.description}
          </p>

       {/* NOTES */}
          <div className="flex flex-wrap gap-2 mt-5 mb-6">

            {product.notesTags?.map((note, index) => (

              <span
                key={index}
                className="bg-black text-[#D4AF37] border border-[#D4AF37]/20 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide shadow-sm hover:scale-105 transition duration-300"
              >
                {note}
              </span>

            ))}

          </div>

          {/* PRICE */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">

            <div className="flex items-center gap-4 flex-wrap">

              <span className="text-3xl font-bold text-black">
                ₹{product.price}
              </span>

              <span className="text-xl text-gray-400 line-through">
                ₹{product.oldPrice}
              </span>

            </div>

            <span className="text-green-600 font-semibold text-lg">
              Save ₹{product.oldPrice - product.price}
            </span>

          </div>

          {/* SHIPPING */}
          <div className="bg-gray-50 rounded-2xl p-5 border mb-8">

            <div className="space-y-3 text-gray-700">

              <p>🚚 Shipping Across India • T&C Apply</p>

              <p>🔒 Secure Checkout</p>

              <p>💯 Authentic Luxury Fragrance</p>

              <p>📦 Easy WhatsApp Support</p>

            </div>

          </div>

          {/* QUANTITY */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">

            <div className="flex items-center border border-gray-300 rounded-2xl overflow-hidden bg-white shadow-sm">

              <button
                onClick={() =>
                  setQty(qty > 1 ? qty - 1 : 1)
                }
                className="w-12 h-12 flex items-center justify-center text-black text-xl font-bold hover:bg-gray-100 transition"
              >
                -
              </button>

              <span className="w-12 text-center text-black font-semibold text-lg">
                {qty}
              </span>

              <button
                onClick={() =>
                  setQty(qty + 1)
                }
                className="w-12 h-12 flex items-center justify-center text-black text-xl font-bold hover:bg-gray-100 transition"
              >
                +
              </button>

            </div>

            <span className="text-gray-700 font-medium">
              Quantity
            </span>

          </div>

          {/* BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <button
              onClick={() => {

                for (let i = 0; i < qty; i++) {
                  addToCart(product);
                }

                alert("Added to cart ✅");

              }}
              className="w-full bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:bg-[#D4AF37] hover:text-black transition duration-300"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {

                addToCart(product);

                window.location.href = "/checkout";

              }}
              className="w-full border-2 border-black text-black py-4 rounded-2xl text-lg font-semibold hover:bg-black hover:text-white transition duration-300"
            >
              Buy Now
            </button>

          </div>

        </div>

      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-24 max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold mb-10 text-center text-black">
          You May Also Like
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {relatedProducts.map((item) => (

            <Link
              key={item.id}
              href={`/product/${item.id}`}
            >

              <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">

                <div className="bg-[#f8f8f8] overflow-hidden flex items-center justify-center">

                  <Image
                    src={item.image}
                    alt={item.name}
                    width={500}
                    height={500}
                    className="w-full h-72 object-contain hover:scale-105 transition-transform duration-700"
                  />

                </div>

                <div className="p-5">

                  <h3 className="text-xl font-semibold mb-2 text-black">
                    {item.name}
                  </h3>

                  <p className="text-gray-500 text-sm mb-4">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">

                    <span className="text-2xl font-bold text-black">
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
