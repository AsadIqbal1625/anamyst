"use client";

import Link from "next/link";
import Image from "next/image";
import { addToCart } from "../lib/cart";

export default function ProductCard({ product }) {

  return (

    <Link href={`/product/${product.id}`}>

      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-gray-200 flex flex-col h-full">

        {/* IMAGE */}
          <div className="relative w-full aspect-[4/5] overflow-hidden">

            <Image
              fill
              src={product.image}
              alt={product.name}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
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
        <div className="p-4 flex flex-col flex-1 bg-white">

          {/* NAME */}
          <h2 className="text-xl font-bold text-black">

            {product.name}

          </h2>

          {/* DESCRIPTION */}
          <p className="text-gray-600 text-sm mt-2">

            Premium Luxury Fragrance

          </p>

                   {/* NOTES */}
              <div className="flex flex-wrap gap-3 mt-4">

                {product.notesTags?.map((note, index) => (

                  <span
                    key={index}
                    className="bg-black text-[#D4AF37] border border-[#D4AF37]/30 px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 hover:border-[#D4AF37] transition duration-300"
                  >
                    {note}
                  </span>

                ))}

              </div>

          {/* RATINGS */}
          <div className="flex items-center gap-2 mt-4">

            <div className="text-yellow-500 text-sm">
              ★★★★★
            </div>

            <span className="text-gray-600 text-sm">

              {product.rating} ({product.reviews} reviews)

            </span>

          </div>

          {/* PRICE */}
          <div className="flex items-center justify-between mt-5">

            <div className="flex items-center gap-2">

              <span className="text-2xl font-bold text-black">

                ₹{product.price}

              </span>

              <span className="text-gray-400 line-through text-sm">

                ₹{product.oldPrice}

              </span>

            </div>

            <span className="text-green-600 text-sm font-semibold">

              In Stock

            </span>

          </div>

          {/* BUTTON */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
              alert("Added to cart");
            }}
            className="mt-6 w-full bg-black text-white py-3 rounded-xl hover:bg-[#D4AF37] hover:text-black transition duration-300"
          >

            Add to Cart

          </button>

        </div>

      </div>

    </Link>

  );
}