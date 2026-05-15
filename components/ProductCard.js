"use client";

import Link from "next/link";
import { addToCart } from "../lib/cart";

export default function ProductCard({ product }) {

  return (

    <Link href={`/product/${product.id}`}>

      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group cursor-pointer border border-gray-100 h-full flex flex-col">

        {/* IMAGE */}
        <div className="relative w-full h-[260px] sm:h-[320px] overflow-hidden bg-[#f8f8f8]">

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
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

        {/* CONTENT */}
        <div className="p-5 flex flex-col flex-1">

          <h2 className="text-2xl font-bold mb-2">
            {product.name}
          </h2>

          <p className="text-gray-500 mb-4">
            Premium Luxury Fragrance
          </p>

          {/* NOTES */}
          <div className="flex flex-wrap gap-2 mb-4">

            {product.notesTags?.map((note, index) => (

              <span
                key={index}
                className="bg-gray-100 text-xs px-3 py-1 rounded-full"
              >
                {note}
              </span>

            ))}

          </div>

          {/* RATINGS */}
          <div className="flex items-center gap-2 mb-4">

            <div className="text-yellow-500">
              ★★★★★
            </div>

            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>

          </div>

          {/* PRICE */}
          <div className="flex items-center justify-between mb-5">

            <div>

              <p className="text-3xl font-bold">
                ₹{product.price}
              </p>

              <p className="text-gray-400 line-through">
                ₹{product.oldPrice}
              </p>

            </div>

            <span className="text-green-600 text-sm font-medium">
              In Stock
            </span>

          </div>

          {/* BUTTON */}
          <button
            onClick={(e) => {

              e.preventDefault();

              addToCart(product);

              alert("Added to cart ✅");

            }}
            className="mt-auto w-full bg-black text-white py-3 rounded-2xl hover:bg-[#D4AF37] hover:text-black transition duration-300"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </Link>

  );
}