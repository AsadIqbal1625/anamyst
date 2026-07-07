"use client";

import Link from "next/link";
import Image from "next/image";
import { addToCart } from "../lib/cart";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {

  return (

    <Link href={`/product/${product._id}`} className="h-full">

      <div className="group h-full flex flex-col bg-white/5 border border-white/10 rounded-[28px] overflow-hidden backdrop-blur-xl hover:border-[#D4AF37]/40 transition duration-300">

        {/* IMAGE */}
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-black/40">

          <Image
            fill
            src={product.image}
            alt={product.name}
            priority
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* TAG */}
          {product.tag && (
            <span className="absolute top-3 left-3 bg-black/80 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full border border-white/10">
              {product.tag}
            </span>
          )}

          {/* BADGE */}
          {product.badge && (
            <span className="absolute top-3 right-3 bg-[#D4AF37] text-black text-xs font-semibold px-3 py-1.5 rounded-full">
              {product.badge}
            </span>
          )}

        </div>

        {/* CONTENT */}
        <div className="p-5 flex flex-col flex-1">

          {/* NAME */}
          <h2 className="text-lg font-semibold text-white leading-snug line-clamp-2">

            {product.name}

          </h2>

          {/* SUBTITLE */}
          <p className="text-gray-500 text-xs uppercase tracking-[2px] mt-2">

            Premium Luxury Fragrance

          </p>

          {/* NOTES */}
          {product.notesTags?.filter(Boolean).length > 0 && (

            <div className="flex flex-wrap gap-2 mt-3">

              {product.notesTags
                .filter(Boolean)
                .slice(0, 3)
                .map((note, index) => (

                  <span
                    key={index}
                    className="bg-black/50 text-[#D4AF37] border border-[#D4AF37]/20 px-3 py-1 rounded-full text-xs"
                  >
                    {note}
                  </span>

                ))}

            </div>

          )}

          {/* RATING */}
          <div className="flex items-center gap-1 mt-3">

            {[1, 2, 3, 4, 5].map((star) => (

              <span
                key={star}
                className={`text-sm ${
                  star <= product.rating
                    ? "text-[#D4AF37]"
                    : "text-gray-700"
                }`}
              >

                ★

              </span>

            ))}

            <span className="text-gray-500 text-xs ml-2">

              ({product.reviews || 0})

            </span>

          </div>

          {/* PRICE + BUTTON (pinned to bottom) */}
          <div className="mt-auto pt-4">

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-2">

                <span className="text-2xl font-bold text-white">

                  ₹{product.price}

                </span>

                {product.oldPrice > 0 && (

                  <span className="text-gray-500 line-through text-sm">

                    ₹{product.oldPrice}

                  </span>

                )}

              </div>

              <span className="text-green-400 text-xs font-semibold uppercase tracking-wide">

                In Stock

              </span>

            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
                toast.success("Added to cart");
              }}
              className="w-full bg-[#D4AF37] text-black font-semibold py-3 rounded-xl hover:opacity-90 transition duration-300"
            >

              Add to Cart

            </button>

          </div>

        </div>

      </div>

    </Link>

  );
}
