"use client";

import { addToCart } from "../lib/cart";
import Link from "next/link";

export default function ProductCard({ product }) {

  // Dynamic ratings for premium ecommerce feel


  return (
    <Link href={`/product/${product.id}`}>

      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition duration-300 cursor-pointer group w-full w-full mx-auto border border-gray-100">

        {/* IMAGE */}
        <div className="relative overflow-hidden">

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
          />

          {/* BEST SELLER */}
          <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full shadow-md">
            {product.tag}
          </span>

          {/* PREMIUM TAG */}
          <span className="absolute top-3 right-3 bg-[#D4AF37] text-black text-xs font-semibold px-3 py-1 rounded-full shadow-md">
           {product.badge}
          </span>

        </div>

        {/* CONTENT */}
        <div className="p-5">

          {/* PRODUCT NAME */}
          <h2 className="text-xl font-semibold mb-1">
            {product.name}
          </h2>

          {/* SHORT DESCRIPTION */}
          <p className="text-gray-500 text-sm mb-3">
            Premium Luxury Fragrance
          </p>

          {/* PERFUME NOTES */}
          <div className="flex flex-wrap gap-2 mb-4">

            <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
              Woody
            </span>

            <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
              Musk
            </span>

            <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
              Long Lasting
            </span>

          </div>

          {/* RATINGS */}
          <div className="flex items-center gap-2 mb-4">

            <div className="flex text-yellow-500 text-sm">
              ★★★★★
            </div>

            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>

          </div>

          {/* PRICE */}
          <div className="flex items-center justify-between mb-2">

            <div>

              <p className="text-2xl font-bold">
                ₹{product.price}
              </p>

              <p className="text-sm text-gray-400 line-through">
                ₹{product.oldPrice}
              </p>

            </div>

            <span className="text-green-600 text-sm font-medium">
              In Stock
            </span>

          </div>

          {/* SHIPPING */}
          <p className="text-sm text-gray-500 mb-4">
            🚚 Shipping Across India • T&C Apply
          </p>

          {/* TRUST BADGES */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-5">

            <span>🔒 Secure</span>

            <span>•</span>

            <span>💯 Authentic</span>

            <span>•</span>

            <span>⭐ Premium</span>

          </div>

          {/* BUTTON */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
              alert("Added to cart ✅");
            }}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-[#D4AF37] hover:text-black transition duration-300 font-medium"
          >
            Add to Cart
          </button>

        </div>
      </div>

    </Link>
  );
}