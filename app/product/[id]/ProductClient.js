"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { useParams }
from "next/navigation";

import Image from "next/image";

import { addToCart }
from "../../../lib/cart";

export default function ProductClient({ productId }) {

  const [product, setProduct] =
    useState(null);

  const [relatedProducts,
    setRelatedProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [qty, setQty] =
    useState(1);

  /* FETCH PRODUCT */
  useEffect(() => {

    async function fetchProduct() {

      try {

        const res =
          await fetch(`/api/products/${productId}`);

        const data =
          await res.json();

        if (data.success) {

          setProduct(
            data.product
          );

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    }

    fetchProduct();

  }, [productId]);

  /* FETCH RELATED PRODUCTS */
  useEffect(() => {

    async function fetchProducts() {

      try {

        const res =
          await fetch(
            "/api/products"
          );

        const data =
          await res.json();

        if (data.success && product) {

          const filtered =
            data.products.filter(
              (p) =>
                p._id !== product._id
            );

          setRelatedProducts(
            filtered.slice(0, 3)
          );

        }

      } catch (error) {

        console.log(error);

      }

    }

    fetchProducts();

  }, [product]);

  /* LOADING */
  if (loading) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center text-3xl font-bold">

        Loading...

      </div>

    );

  }

  /* NOT FOUND */
  if (!product) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center text-3xl font-bold">

        Product not found

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* HERO */}
      <section className="relative px-4 py-10 md:px-6 md:py-16 border-b border-[#D4AF37]/20">

        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent" />

        <div className="relative grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 lg:gap-8 items-stretch max-w-7xl mx-auto">

          {/* PRODUCT IMAGE */}
          <div className="bg-white/5 border border-white/10 rounded-[36px] backdrop-blur-xl p-4 md:p-6 relative overflow-hidden">

            <div className="flex items-center justify-center bg-black/40 rounded-[28px] overflow-hidden relative">

              <Image
                src={product.image}
                alt={product.name}
                width={700}
                height={700}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="w-full h-auto object-contain transition-transform duration-700 hover:scale-105"
              />

              <span className="absolute top-4 left-4 bg-black text-white text-xs px-4 py-2 rounded-full z-10 border border-white/10">

                {product.tag}

              </span>

              <span className="absolute top-4 right-4 bg-[#D4AF37] text-black text-xs font-semibold px-4 py-2 rounded-full z-10">

                {product.badge}

              </span>

            </div>

          </div>

          {/* PRODUCT DETAILS */}
          <div className="bg-white/5 border border-white/10 rounded-[28px] backdrop-blur-xl p-4 md:p-5">

            <p className="uppercase tracking-[4px] text-[#D4AF37] text-[10px] mb-3">

              ANAMYST Luxury Collection

            </p>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">

              {product.name}

            </h1>

            <p className="text-gray-400 text-sm mb-4">

              Premium Luxury Fragrance Collection

            </p>

            {/* RATING */}
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">

              <div className="flex items-center gap-3">

                <span className="text-[#D4AF37] text-lg">

                  ★★★★★

                </span>

                <span className="text-gray-400 text-sm">

                  {product.rating}
                  {" "}
                  (
                  {product.reviews}
                  {" "}
                  reviews)

                </span>

              </div>

              <span className="text-green-400 font-semibold">

                In Stock

              </span>

            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-300 text-sm leading-6 mb-5">

              {product.description}

            </p>

            {/* NOTES */}
            <div className="flex flex-wrap gap-2 mb-5">

              {product.notesTags?.map(
                (note, index) => (

                  <span
                    key={index}
                    className="bg-black text-[#D4AF37] border border-[#D4AF37]/20 px-3 py-1 rounded-full text-xs font-medium"
                  >

                    {note}

                  </span>

                )
              )}

            </div>
            {/* FRAGRANCE PROFILE */}

          <div className="mb-4">

            <h3 className="text-lg font-semibold text-white mb-2">
              Fragrance Profile
            </h3>

            <div className="grid grid-cols-2 gap-2">

              {[
                { label: "Top Notes", value: product.topNotes },
                { label: "Heart Notes", value: product.heartNotes },
                { label: "Base Notes", value: product.baseNotes },
                { label: "Longevity", value: product.longevity },
                { label: "Projection", value: product.projection },
                { label: "Occasion", value: product.occasion },
                { label: "Season", value: product.season },
              ]
                .filter((item) => item.value)
                .map((item, index) => (
                  <div
                    key={index}
                    className="bg-black/30 border border-[#D4AF37]/15 rounded-xl px-3 py-2 hover:border-[#D4AF37]/40 transition-all duration-300"
                  >
                    <p className="text-[#D4AF37] text-[9px] uppercase tracking-[1.5px] mb-0.5">
                      {item.label}
                    </p>

                    <p className="text-white text-xs leading-5">
                      {item.value}
                    </p>
                  </div>
                ))}

            </div>

          </div>
            {/* PRICE */}
            <div className="flex items-center justify-between flex-wrap gap-2 mb-5">

              <div className="flex items-center gap-4 flex-wrap">

                <span className="text-3xl font-bold text-white">

                  ₹{product.price}

                </span>

                <span className="text-lg text-gray-500 line-through">

                  ₹{product.oldPrice}

                </span>

              </div>

             <span className="text-green-400 font-semibold text-sm">

                Save ₹
                {product.oldPrice -
                  product.price}

              </span>

            </div>

            {/* SHIPPING */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 mb-4">

          <div className="border border-white/10 rounded-xl py-2 text-center text-xs text-gray-300">
            🚚 Shipping all over India
          </div>

          <div className="border border-white/10 rounded-xl py-2 text-center text-xs text-gray-300">
            🔒 Secure Checkout
          </div>

          <div className="border border-white/10 rounded-xl py-2 text-center text-xs text-gray-300">
            💯 Authentic
          </div>

        </div>

            {/* QUANTITY */}
            <div className="flex items-center justify-between flex-wrap gap-2 mb-5">

              <div className="flex items-center border border-white/10 rounded-2xl overflow-hidden bg-black">

                <button
                  onClick={() =>
                    setQty(
                      qty > 1
                        ? qty - 1
                        : 1
                    )
                  }
                  className="w-12 h-12 flex items-center justify-center text-white text-xl font-bold hover:bg-[#D4AF37] hover:text-black transition"
                >

                  -

                </button>

                <span className="w-12 text-center text-white font-semibold text-lg">

                  {qty}

                </span>

                <button
                  onClick={() =>
                    setQty(qty + 1)
                  }
                  className="w-12 h-12 flex items-center justify-center text-white text-xl font-bold hover:bg-[#D4AF37] hover:text-black transition"
                >

                  +

                </button>

              </div>

              <span className="text-gray-400 font-medium">

                Quantity

              </span>

            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <button
                onClick={() => {

                  for (
                    let i = 0;
                    i < qty;
                    i++
                  ) {

                    addToCart(product);

                  }

                  alert(
                    "Added to cart ✅"
                  );

                }}
                className="w-full bg-[#D4AF37] text-black py-3 rounded-xl text-base font-semibold hover:opacity-90 transition duration-300"
              >

                Add to Cart

              </button>

              <button
                onClick={() => {

                  addToCart(product);

                  window.location.href =
                    "/checkout";

                }}
                className="w-full border border-[#D4AF37] text-[#D4AF37] py-3 rounded-xl text-base font-semibold hover:bg-[#D4AF37] hover:text-black transition duration-300"
              >

                Buy Now

              </button>

            </div>

          </div>

        </div>

      </section>

      {/* RELATED PRODUCTS */}
      <section className="px-6 py-20">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-4xl font-bold mb-12 text-center">

            You May Also Like

          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {relatedProducts.map(
              (item) => (

                <Link
                  key={item._id}
                  href={`/product/${item._id}`}
                >

                  <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden hover:border-[#D4AF37]/40 transition duration-300 backdrop-blur-xl">

                    <div className="bg-black/40 overflow-hidden flex items-center justify-center">

                      <Image
                        src={item.image}
                        alt={item.name}
                        width={500}
                        height={500}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="w-full h-auto max-h-72 object-contain hover:scale-105 transition-transform duration-700"
                      />

                    </div>

                    <div className="p-6">

                      <h3 className="text-2xl font-semibold mb-3 text-white">

                        {item.name}

                      </h3>

                      <p className="text-gray-400 text-sm mb-5 leading-7">

                        {item.description}

                      </p>

                      <div className="flex items-center justify-between">

                        <span className="text-3xl font-bold text-white">

                          ₹{item.price}

                        </span>

                        <span className="text-green-400 font-medium">

                          In Stock

                        </span>

                      </div>

                    </div>

                  </div>

                </Link>

              )
            )}

          </div>

        </div>

      </section>

    </div>

  );

}
