"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import AdminProtection
from "../../../components/AdminProtection";

export default function OrdersPage() {

  const [orders,
    setOrders] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [activeFilter,
    setActiveFilter] =
    useState("All");

  /* FETCH ORDERS */
  async function fetchOrders() {

    try {

      const res =
        await fetch(
          "/api/orders"
        );

      const data =
        await res.json();

      if (data.success) {

        setOrders(
          data.orders
        );

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    fetchOrders();

  }, []);

  /* UPDATE STATUS */
  async function updateStatus(
    id,
    status
  ) {

    try {

      const res =
        await fetch(

          `/api/orders/${id}`,

          {

            method: "PATCH",

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify({

              orderStatus:
                status,

            }),

          }

        );

      const data =
        await res.json();

      if (data.success) {

        fetchOrders();

      }

    } catch (error) {

      console.log(error);

    }

  }

  /* FILTERED ORDERS */
  const filteredOrders =

    activeFilter === "All"

      ? orders

      : orders.filter(

          (order) =>

            order.orderStatus ===
            activeFilter

        );

  /* LOADING */
  if (loading) {

    return (

      <AdminProtection>

        <div className="min-h-screen bg-black text-white flex items-center justify-center text-3xl font-bold">

          Loading Orders...

        </div>

      </AdminProtection>

    );

  }

  return (

    <AdminProtection>

      <div className="min-h-screen bg-black text-white px-4 py-10">

        <div className="max-w-7xl mx-auto">

          {/* TITLE */}
          <div className="mb-10">

            <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-4">

              ANAMYST Admin

            </p>

            <h1 className="text-5xl font-bold mb-4">

              Orders Dashboard

            </h1>

            <p className="text-gray-400 text-lg">

              Manage customer orders and delivery status.

            </p>

          </div>

          {/* ORDER FILTERS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

            {/* ALL */}
            <button
              onClick={() =>
                setActiveFilter("All")
              }
              className={`rounded-[28px] p-6 text-left transition duration-300 border ${
                activeFilter === "All"
                  ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                  : "bg-white/5 text-white border-white/10"
              }`}
            >

              <p className="text-sm mb-3">

                Total Orders

              </p>

              <h2 className="text-4xl font-bold">

                {orders.length}

              </h2>

            </button>

            {/* PENDING */}
            <button
              onClick={() =>
                setActiveFilter("Pending")
              }
              className={`rounded-[28px] p-6 text-left transition duration-300 border ${
                activeFilter === "Pending"
                  ? "bg-yellow-500 text-black border-yellow-500"
                  : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
              }`}
            >

              <p className="text-sm mb-3">

                Pending

              </p>

              <h2 className="text-4xl font-bold">

                {
                  orders.filter(
                    (o) =>
                      o.orderStatus ===
                      "Pending"
                  ).length
                }

              </h2>

            </button>

            {/* DELIVERED */}
            <button
              onClick={() =>
                setActiveFilter("Delivered")
              }
              className={`rounded-[28px] p-6 text-left transition duration-300 border ${
                activeFilter === "Delivered"
                  ? "bg-green-500 text-black border-green-500"
                  : "bg-green-500/10 text-green-400 border-green-500/20"
              }`}
            >

              <p className="text-sm mb-3">

                Delivered

              </p>

              <h2 className="text-4xl font-bold">

                {
                  orders.filter(
                    (o) =>
                      o.orderStatus ===
                      "Delivered"
                  ).length
                }

              </h2>

            </button>

            {/* CANCELLED */}
            <button
              onClick={() =>
                setActiveFilter("Cancelled")
              }
              className={`rounded-[28px] p-6 text-left transition duration-300 border ${
                activeFilter === "Cancelled"
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
            >

              <p className="text-sm mb-3">

                Cancelled

              </p>

              <h2 className="text-4xl font-bold">

                {
                  orders.filter(
                    (o) =>
                      o.orderStatus ===
                      "Cancelled"
                  ).length
                }

              </h2>

            </button>

          </div>

          {/* EMPTY */}
          {filteredOrders.length === 0 && (

            <div className="text-center py-24 border border-white/10 rounded-[32px] bg-white/5">

              <h2 className="text-4xl font-bold mb-5">

                No Orders Found

              </h2>

              <p className="text-gray-400">

                No matching orders available.

              </p>

            </div>

          )}

          {/* ORDERS */}
          <div className="space-y-8">

            {filteredOrders.map(
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

                      <p className="text-gray-400 mt-2">

                        {order.email}

                      </p>

                      <p className="text-gray-400">

                        {order.phone}

                      </p>

                    </div>

                    {/* STATUS */}
                    <div className="flex flex-wrap gap-3">

                      <button
                        onClick={() =>
                          updateStatus(
                            order._id,
                            "Pending"
                          )
                        }
                        className={`px-5 py-3 rounded-2xl font-semibold transition ${
                          order.orderStatus === "Pending"
                            ? "bg-yellow-500 text-black"
                            : "bg-white/10"
                        }`}
                      >

                        Pending

                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            order._id,
                            "Delivered"
                          )
                        }
                        className={`px-5 py-3 rounded-2xl font-semibold transition ${
                          order.orderStatus === "Delivered"
                            ? "bg-green-500 text-black"
                            : "bg-white/10"
                        }`}
                      >

                        Delivered

                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            order._id,
                            "Cancelled"
                          )
                        }
                        className={`px-5 py-3 rounded-2xl font-semibold transition ${
                          order.orderStatus === "Cancelled"
                            ? "bg-red-500 text-white"
                            : "bg-white/10"
                        }`}
                      >

                        Cancelled

                      </button>

                    </div>

                  </div>

                  {/* ADDRESS */}
                  <div className="mb-8 bg-black/30 border border-white/10 rounded-2xl p-5">

                    <h3 className="text-[#D4AF37] font-semibold mb-3">

                      Shipping Address

                    </h3>

                    <p className="text-gray-300 leading-8">

                      {order.address},
                      {" "}
                      {order.city},
                      {" "}
                      {order.state},
                      {" "}
                      {order.pincode}

                    </p>

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

                          <div className="relative w-[90px] h-[90px] bg-black/30 rounded-2xl overflow-hidden">

                            <Image
                              fill
                              sizes="90px"
                              src={product.image}
                              alt={product.name}
                              className="object-contain p-2"
                            />

                          </div>

                          <div className="flex-1">

                            <h3 className="text-xl font-semibold">

                              {product.name}

                            </h3>

                            <p className="text-gray-400 mt-2">

                              Qty:
                              {" "}
                              {product.quantity}

                            </p>

                            <p className="text-[#D4AF37] text-xl font-bold mt-2">

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

    </AdminProtection>

  );

}