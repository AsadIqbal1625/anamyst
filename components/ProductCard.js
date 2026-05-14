"use client";

import { useParams } from "next/navigation";
import { products } from "../../../data/products";
import { addToCart } from "../../../lib/cart";
import Image from "next/image";

export default function ProductPage() {

  const params = useParams();

  const product = products.find(
    (p) => p.id.toString() === params.id
  );

  if (!product) {

    return (

      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">
        Product not found
      </div>

    );

  }

  return (

    <div className="min-h-screen bg-[#f7f7f7] px-4 sm:px-6 lg:px-10 py-8">

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* IMAGE SECTION */}
          <div className="relative bg-[#f4f4f4] flex items-center justify-center p-4 sm:p-8">

            <div className="relative w-full max-w-md">

              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={700}
                className="w-full h-auto object-contain rounded-3xl"
                priority
              />

              {/* LEFT BADGE */}
              <span className="absolute top-4 left-4 bg-black text-white text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg">
                {product.tag}
              </span>

              {/* RIGHT BADGE */}
              <span className="absolute top-4 right-4 bg-[#D4AF37] text-black text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                {product.badge}
              </span>

            </div>

          </div>

          {/* CONTENT SECTION */}
          <div className="p-6 sm:p-10 flex flex-col justify-center">

            {/* TITLE */}
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              {product.name}
            </h1>

            {/* SUBTITLE */}
            <p className="text-gray-500 text-base sm:text-lg mb-6">
              Premium Luxury Fragrance crafted for elegance and long lasting freshness.
            </p>

            {/* NOTES */}
            <div className="flex flex-wrap gap-3 mb-6">

              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                Woody
              </span>

              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                Musk
              </span>

              <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                Long Lasting
              </span>

            </div>

            {/* RATING */}
            <div className="flex items-center gap-3 mb-6">

              <div className="text-yellow-500 text-lg">
                ★★★★★
              </div>

              <span className="text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>

            </div>

            {/* PRICE */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">

              <p className="text-4xl font-bold">
                ₹{product.price}
              </p>

              <p className="text-xl text-gray-400 line-through">
                ₹{product.oldPrice}
              </p>

              <span className="text-green-600 font-semibold">
                In Stock
              </span>

            </div>

            {/* SHIPPING */}
            <div className="mb-6 text-gray-600">

              <p className="mb-2">
                🚚 Shipping Across India
              </p>

              <p>
                🔒 100% Authentic Premium Product
              </p>

            </div>

            {/* BUTTON */}
            <button
              onClick={() => {
                addToCart(product);
                alert("Added to cart ✅");
              }}
              className="w-full sm:w-fit bg-black text-white px-10 py-4 rounded-2xl hover:bg-[#D4AF37] hover:text-black transition duration-300 text-lg font-semibold"
            >
              Add to Cart
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}