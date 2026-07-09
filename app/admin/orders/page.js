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

  /* UPDATE PAYMENT STATUS */
  async function updatePayment(
    id,
    paymentStatus
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
              paymentStatus,
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

  /* FILTERED */
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

        <div className="text-white text-lg">

          Loading orders...

        </div>

      </AdminProtection>

    );

  }

  const statusBadgeClass = (status) =>

    status === "Delivered"
      ? "bg-green-500/15 text-green-400 border-green-500/30"
      : status === "Cancelled"
      ? "bg-red-500/15 text-red-400 border-red-500/30"
      : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";

  return (

    <div className="text-white space-y-8">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <p className="text-gray-400">

          Manage customer orders and delivery status.

        </p>

        {/* file download, not a page nav — <Link> would be wrong here */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/orders/export"
          className="bg-white/10 border border-[#D4AF37]/40 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition whitespace-nowrap"
        >
          Download Orders (Excel)
        </a>

      </div>

      {/* STATS / FILTERS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {[

          { label: "Total Orders", value: orders.length, key: "All", accent: "#D4AF37" },
          { label: "Pending", value: orders.filter((o) => o.orderStatus === "Pending").length, key: "Pending", accent: "#eab308" },
          { label: "Delivered", value: orders.filter((o) => o.orderStatus === "Delivered").length, key: "Delivered", accent: "#22c55e" },
          { label: "Cancelled", value: orders.filter((o) => o.orderStatus === "Cancelled").length, key: "Cancelled", accent: "#ef4444" },

        ].map((stat) => (

          <button
            key={stat.key}
            onClick={() => setActiveFilter(stat.key)}
            className={`rounded-2xl p-5 text-left border transition ${
              activeFilter === stat.key
                ? "border-[#D4AF37]/60 bg-white/10"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >

            <p className="text-sm text-gray-400 mb-2">
              {stat.label}
            </p>

            <p
              className="text-3xl font-bold"
              style={{ color: stat.accent }}
            >
              {stat.value}
            </p>

          </button>

        ))}

      </div>

      {/* EMPTY */}
      {filteredOrders.length === 0 && (

        <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5">

          <h2 className="text-2xl font-bold mb-2">
            No Orders Found
          </h2>

          <p className="text-gray-400">
            No matching orders available.
          </p>

        </div>

      )}

      {/* ORDERS */}
      <div className="space-y-5">

        {filteredOrders.map(
          (order) => (

            <div
              key={order._id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >

              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-5 border-b border-white/10">

                <div>

                  <div className="flex items-center gap-3 flex-wrap">

                    <h2 className="text-lg font-semibold text-white">
                      {order.customerName}
                    </h2>

                    {order.orderId && (
                      <span className="text-xs text-gray-500 font-mono">
                        #{order.orderId}
                      </span>
                    )}

                  </div>

                  <p className="text-sm text-gray-400 mt-1">
                    {order.email} · {order.phone}
                  </p>

                  {order.createdAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  )}

                </div>

                <div className="flex flex-col items-start md:items-end gap-2">

                  <div className="flex items-center gap-2">

                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${statusBadgeClass(order.orderStatus)}`}
                    >
                      {order.orderStatus || "Pending"}
                    </span>

                    <select
                      value={order.orderStatus || "Pending"}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                      className="bg-black/40 border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 outline-none focus:border-[#D4AF37]/60"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                  </div>

                  <div className="flex items-center gap-2 text-xs">

                    <span className="text-gray-500">
                      {order.paymentMethod || "COD"}
                    </span>

                    <span
                      className={
                        order.paymentStatus === "Paid"
                          ? "text-green-400 font-semibold"
                          : "text-yellow-400 font-semibold"
                      }
                    >
                      {order.paymentStatus || "Pending"}
                    </span>

                    <button
                      onClick={() =>
                        updatePayment(
                          order._id,
                          order.paymentStatus === "Paid" ? "Pending" : "Paid"
                        )
                      }
                      className="text-[#D4AF37] hover:underline"
                    >
                      {order.paymentStatus === "Paid" ? "Mark Pending" : "Mark Paid"}
                    </button>

                  </div>

                </div>

              </div>

              {/* BODY */}
              <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-6 pt-5">

                {/* ADDRESS */}
                <div className="bg-black/30 border border-white/10 rounded-xl p-4">

                  <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wide mb-2">
                    Shipping Address
                  </p>

                  <p className="text-sm text-gray-300 leading-6">
                    {order.address}, {order.city}, {order.state}, {order.pincode}
                  </p>

                </div>

                {/* PRODUCTS */}
                <div className="space-y-3">

                  {order.products.map(
                    (product, index) => (

                      <div
                        key={index}
                        className="flex items-center gap-3"
                      >

                        <div className="relative w-14 h-14 bg-black/30 rounded-xl overflow-hidden shrink-0">

                          <Image
                            fill
                            loading="lazy"
                            sizes="56px"
                            src={product.image}
                            alt={product.name}
                            className="object-cover"
                          />

                        </div>

                        <div className="flex-1 min-w-0">

                          <p className="text-sm font-medium text-white truncate">
                            {product.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            Qty {product.quantity} × ₹{product.price}
                          </p>

                        </div>

                        <p className="text-sm font-semibold text-[#D4AF37] shrink-0">
                          ₹{product.quantity * product.price}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/10">

                <span className="text-sm text-gray-400">
                  Total Amount
                </span>

                <span className="text-2xl font-bold text-[#D4AF37]">
                  ₹{order.totalAmount}
                </span>

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

}