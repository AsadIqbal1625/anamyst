"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { products } from "../../../data/products";
import { addToCart } from "../../../lib/cart";
import ProductCard from "../../../components/ProductCard";

export default function ProductPage() {

  const params = useParams();

  const product = products.find(
    (p) => p.id === Number(params.id)
  );

  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#f5f5f5] py-6 px-4 overflow-x-hidden">

      <div className="max-w-7xl mx-auto">

        {/* PRODUCT SECTION */}
        <div className="bg-white rounded-[30px] shadow-xl overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 sm:p-6 lg:p-10">

            {/* IMAGE SIDE */}
            <div className="relative">

              {/* TAGS */}
              <div className="absolute top-4 left-4 z-20 flex gap-3">

                <span className="bg-black text-white text-xs px-4 py-2 rounded-full">
                  {product.tag}
                </span>

                <span className="bg-[#D4AF37] text-black text-xs font-semibold px-4 py-2 rounded-full">
                  {product.badge}
                </span>

              </div>

              {/* IMAGE */}
              <div className="bg-[#f8f8f8] rounded-3xl flex items-center justify-center p-4">
                <div className="w-full aspect-[4/5] sm:aspect-[4/5] lg:h-[650px] overflow-hidden rounded-3xl bg-[#f8f8f8]">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-3xl"
                  />
                </div>
                
              </div>

            </div>

            {/* DETAILS SIDE */}
            <div className="flex flex-col justify-center">

              {/* TITLE */}
              <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
                {product.name}
              </h1>

              {/* SUBTITLE */}
              <p className="text-gray-600 text-lg mb-4">
                Premium Luxury Fragrance Collection
              </p>

              {/* RATINGS */}
              <div className="flex flex-wrap items-center gap-3 mb-6">

                <div className="text-yellow-500 text-lg">
                  ★★★★★
                </div>

                <span className="text-gray-600">
                  4.6 (182 reviews)
                </span>

                <span className="text-green-600 text-sm font-medium">
                  In Stock
                </span>

              </div>

              {/* DESCRIPTION */}
              <p className="text-gray-700 text-base sm:text-lg leading-7 mb-6">
                {product.description}
              </p>

              {/* NOTES */}
              <div className="mb-8">

                <h3 className="font-semibold text-lg mb-3">
                  Fragrance Notes
                </h3>

                <div className="flex flex-wrap gap-3">

                  <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                    Citrus
                  </span>

                  <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                    Rose
                  </span>

                  <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                    Oud
                  </span>

                  <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                    Musk
                  </span>

                  <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                    Long Lasting
                  </span>

                </div>

              </div>

              {/* PRICE */}
              <div className="flex flex-wrap items-center gap-4 mb-8">

                <p className="text-4xl sm:text-5xl font-bold">
                  ₹{product.price}
                </p>

                <p className="text-xl text-gray-400 line-through">
                  ₹{product.price + 500}
                </p>

                <span className="text-green-600 font-medium">
                  Save ₹500
                </span>

              </div>

              {/* SHIPPING */}
              <div className="bg-[#fafafa] border border-gray-200 rounded-2xl p-5 mb-8 space-y-3">

                <p className="text-gray-700">
                  🚚 Shipping Across India • T&C Apply
                </p>

                <p className="text-gray-700">
                  🔒 Secure Checkout
                </p>

                <p className="text-gray-700">
                  💯 Authentic Luxury Fragrance
                </p>

                <p className="text-gray-700">
                  📦 Easy WhatsApp Support
                </p>

              </div>

              {/* QUANTITY */}
              <div className="flex items-center gap-5 mb-8 flex-wrap">

                <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3">

                  <button
                    onClick={() =>
                      setQty(qty > 1 ? qty - 1 : 1)
                    }
                    className="w-8 h-8 rounded-lg bg-white shadow"
                  >
                    -
                  </button>

                  <span className="text-xl font-semibold">
                    {qty}
                  </span>

                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-8 h-8 rounded-lg bg-white shadow"
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

                    for (let i = 0; i < qty; i++) {
                      addToCart(product);
                    }

                    alert("Added to cart ✅");

                  }}
                  className="flex-1 bg-black text-white py-4 rounded-2xl hover:bg-[#D4AF37] hover:text-black transition duration-300 text-lg font-medium"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => {

                    for (let i = 0; i < qty; i++) {
                      addToCart(product);
                    }

                    window.location.href = "/checkout";

                  }}
                  className="flex-1 bg-black text-white py-4 rounded-2xl hover:bg-[#D4AF37] hover:text-black transition duration-300 text-lg font-medium"
                >
                  Buy Now
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-20">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">

            <h2 className="text-3xl sm:text-4xl font-bold">
              You may also like
            </h2>

            <p className="text-gray-500">
              Explore more luxury fragrances
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {products
              .filter((p) => p.id !== product.id)
              .slice(0, 3)
              .map((item) => (

                <ProductCard
                  key={item.id}
                  product={item}
                />

              ))}

          </div>

        </div>

      </div>

    </div>
  );
}