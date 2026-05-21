"use client";

import {
  useState,
} from "react";

import Image from "next/image";

export default function TrackOrderPage() {

  const [search,
    setSearch] =
    useState("");

  const [orders,
    setOrders] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  const [searched,
    setSearched] =
    useState(false);

  /* SEARCH ORDERS */
  async function handleSearch(
    e
  ) {

    e.preventDefault();

    setLoading(true);

    try {

      const res =
        await fetch(
          "/api/orders"
        );

      const data =
        await res.json();

      if (data.success) {
const filtered =
  data.orders.filter(

    (order) =>

      order.orderId
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      order.phone
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      order.email
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

  );

        setOrders(
          filtered
        );

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

      setSearched(true);

    }

  }

  return (

    <div className="min-h-screen bg-black text-white px-4 py-16">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">

          <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-5">

            ANAMYST Support

          </p>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">

            Track Your Order

          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-8">

            Enter your phone number or email to check your latest order status.

          </p>

        </div>

        {/* SEARCH BOX */}
        <form
                onSubmit={handleSearch}
                className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-8 mb-14"
                >

                <div className="flex flex-col md:flex-row gap-5">

        <input
            type="text"
            placeholder="Enter Order ID, Phone or Email"
            value={search}
            onChange={(e) =>
            setSearch(
                e.target.value
            )
            }
            className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-5 outline-none focus:border-[#D4AF37] text-white placeholder:text-gray-500"
            required
        />

        {/* SEARCH BUTTON */}
        <button
            type="submit"
            className="bg-[#D4AF37] hover:bg-[#c19b2e] text-black font-bold px-10 py-5 rounded-2xl transition duration-300"
        >

            {loading
            ? "Searching..."
            : "Track Order"}

        </button>

        {/* CLEAR BUTTON */}
        <button
            type="button"
            onClick={() => {

            setSearch("");

            setOrders([]);

            setSearched(false);

            }}
            className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold px-8 py-5 rounded-2xl transition duration-300"
        >

            Clear

        </button>

        </div>

        </form>

        {/* NO RESULT */}
        {searched &&
          orders.length === 0 && (

            <div className="text-center border border-white/10 bg-white/5 rounded-[32px] py-20">

              <h2 className="text-4xl font-bold mb-5">

                No Orders Found

              </h2>

              <p className="text-gray-400">

                Please check your phone number or email.

              </p>

            </div>

          )}

        {/* ORDERS */}
        <div className="space-y-8">

          {orders.map(
            (order) => (

              <div
                key={order._id}
                className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-8"
              >

                {/* TOP */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

                  <div>

                    <h2 className="text-3xl font-bold">

                      {order.customerName}

                    </h2>

                    <p className="text-gray-400 mt-3">

                      {order.email}

                    </p>

                    <p className="text-gray-400">

                      {order.phone}

                    </p>

                  </div>

                  {/* STATUS */}
                  <div>

                    <span
                      className={`px-6 py-3 rounded-2xl font-bold text-lg ${
                        order.orderStatus ===
                        "Delivered"

                          ? "bg-green-500 text-black"

                          : order.orderStatus ===
                            "Cancelled"

                          ? "bg-red-500 text-white"

                          : "bg-yellow-500 text-black"
                      }`}
                    >

                      {order.orderStatus}

                    </span>

                  </div>

                </div>

                {/* PRODUCTS */}
                <div className="space-y-5">

                  {order.products.map(
                    (
                      product,
                      index
                    ) => (

                      <div
                        key={index}
                        className="flex gap-5 border-b border-white/10 pb-5"
                      >

                        {/* IMAGE */}
                        <div className="relative w-[90px] h-[90px] bg-black/40 rounded-2xl overflow-hidden">

                          <Image
                            fill
                            sizes="90px"
                            src={product.image}
                            alt={product.name}
                            className="object-contain p-2"
                          />

                        </div>

                        {/* INFO */}
                        <div className="flex-1">

                          <h3 className="text-2xl font-semibold">

                            {product.name}

                          </h3>

                          <p className="text-gray-400 mt-2">

                            Quantity:
                            {" "}
                            {product.quantity}

                          </p>

                          <p className="text-[#D4AF37] text-2xl font-bold mt-2">

                            ₹
                            {product.price}

                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

                {/* BOTTOM */}
                <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                  <div>

                    <p className="text-gray-400">

                      Payment Method

                    </p>

                    <h3 className="text-2xl font-bold mt-2">

                      {order.paymentMethod}

                    </h3>

                  </div>

                  <div className="text-right">

                    <p className="text-gray-400">

                      Total Amount

                    </p>

                    <h3 className="text-4xl font-bold text-[#D4AF37] mt-2">

                      ₹
                      {order.totalAmount}

                    </h3>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );

}