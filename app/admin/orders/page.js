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

  const [search, setSearch] = useState("");

  const [paymentFilter, setPaymentFilter] = useState("All");

  const [selected, setSelected] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({});

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

  /* DELETE ONE ORDER */
  async function deleteOrder(id) {

    if (
      !confirm(
        "Delete this order permanently? Stock will be restored and the customer's totals adjusted."
      )
    ) return;

    await fetch(`/api/orders/${id}`, { method: "DELETE" });

    setSelected((s) => s.filter((x) => x !== id));

    fetchOrders();

  }

  /* DELETE SELECTED ORDERS */
  async function deleteSelected() {

    if (
      !confirm(
        `Delete ${selected.length} order(s) permanently? Stock will be restored and customer totals adjusted.`
      )
    ) return;

    for (const id of selected) {
      await fetch(`/api/orders/${id}`, { method: "DELETE" });
    }

    setSelected([]);

    fetchOrders();

  }

  function toggleSelect(id) {

    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  }

  /* EDIT ORDER DETAILS */
  function startEdit(order) {

    setEditingId(order._id);

    setEditForm({
      customerName: order.customerName || "",
      email: order.email || "",
      phone: order.phone || "",
      address: order.address || "",
      city: order.city || "",
      state: order.state || "",
      pincode: order.pincode || "",
    });

  }

  async function saveEdit(id) {

    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    setEditingId(null);

    fetchOrders();

  }

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

  /* FILTERED — status segment + payment segment + search */
  const q = search.trim().toLowerCase();

  const filteredOrders = orders.filter((order) => {

    const matchesStatus =
      activeFilter === "All" ||
      order.orderStatus === activeFilter;

    const matchesPayment =
      paymentFilter === "All" ||
      (paymentFilter === "Paid" && order.paymentStatus === "Paid") ||
      (paymentFilter === "Unpaid" && order.paymentStatus !== "Paid") ||
      paymentFilter === order.paymentMethod;

    const matchesSearch =
      !q ||
      [
        order.orderId,
        order.customerName,
        order.phone,
        order.email,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));

    return matchesStatus && matchesPayment && matchesSearch;

  });

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
          className="bg-white/10 border border-gold/40 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition whitespace-nowrap"
        >
          Download Orders (Excel)
        </a>

      </div>

      {/* STATS / FILTERS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {[

          { label: "Total Orders", value: orders.length, key: "All", accent: "var(--color-gold)" },
          { label: "Pending", value: orders.filter((o) => o.orderStatus === "Pending").length, key: "Pending", accent: "var(--color-yellow-400)" },
          { label: "Delivered", value: orders.filter((o) => o.orderStatus === "Delivered").length, key: "Delivered", accent: "var(--color-green-400)" },
          { label: "Cancelled", value: orders.filter((o) => o.orderStatus === "Cancelled").length, key: "Cancelled", accent: "var(--color-red-400)" },

        ].map((stat) => (

          <button
            key={stat.key}
            onClick={() => setActiveFilter(stat.key)}
            className={`rounded-2xl p-5 text-left border transition ${
              activeFilter === stat.key
                ? "border-gold/60 bg-white/10"
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

      {/* SEARCH + PAYMENT SEGMENT */}
      <div className="flex flex-col md:flex-row gap-4">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Order ID, name, phone or email..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm outline-none focus:border-gold/60"
        />

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60"
        >
          <option value="All">All payments</option>
          <option value="Paid">Paid only</option>
          <option value="Unpaid">Unpaid only</option>
          <option value="COD">COD</option>
          <option value="RAZORPAY">Razorpay</option>
        </select>

      </div>

      {/* BULK ACTIONS */}
      {selected.length > 0 && (

        <div className="flex items-center justify-between gap-4 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3">

          <span className="text-sm">
            {selected.length} order(s) selected
          </span>

          <div className="flex gap-3">

            <button
              onClick={() => setSelected([])}
              className="px-4 py-2 rounded-lg border border-white/20 text-xs hover:border-white/40 transition"
            >
              Clear
            </button>

            <button
              onClick={deleteSelected}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition"
            >
              Delete Selected
            </button>

          </div>

        </div>

      )}

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

                    <input
                      type="checkbox"
                      checked={selected.includes(order._id)}
                      onChange={() => toggleSelect(order._id)}
                      className="w-4 h-4 accent-gold"
                      title="Select for bulk delete"
                    />

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
                      className="bg-black/40 border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 outline-none focus:border-gold/60"
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
                      className="text-gold hover:underline"
                    >
                      {order.paymentStatus === "Paid" ? "Mark Pending" : "Mark Paid"}
                    </button>

                  </div>

                </div>

              </div>

              {/* PAID, BUT NEEDS THE OWNER (e.g. sold out during payment) */}
              {order.needsReview && (

                <div className="mt-5 bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3 text-sm text-red-300">
                  ⚠ Needs review: {order.reviewNote}
                </div>

              )}

              {/* CONFIRMATION EMAIL DID NOT GO OUT */}
              {order.emailStatus === "failed" && (

                <div className="mt-5 bg-yellow-500/10 border border-yellow-500/40 rounded-xl px-4 py-3 text-sm text-yellow-300">
                  ✉ Confirmation email was not sent: {order.emailError || "unknown reason"}
                </div>

              )}

              {/* EDIT FORM */}
              {editingId === order._id && (

                <div className="mt-5 bg-black/30 border border-gold/30 rounded-xl p-5">

                  <p className="text-gold text-xs font-semibold uppercase tracking-wide mb-4">
                    Edit Customer &amp; Shipping Details
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                    {[
                      ["customerName", "Full Name"],
                      ["phone", "Phone"],
                      ["email", "Email"],
                      ["city", "City"],
                      ["state", "State"],
                      ["pincode", "Pincode"],
                    ].map(([key, label]) => (

                      <input
                        key={key}
                        value={editForm[key] ?? ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, [key]: e.target.value })
                        }
                        placeholder={label}
                        className="bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gold/60"
                      />

                    ))}

                    <textarea
                      value={editForm.address ?? ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, address: e.target.value })
                      }
                      placeholder="Full Address"
                      rows={2}
                      className="md:col-span-2 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gold/60"
                    />

                  </div>

                  <div className="flex gap-3 mt-4">

                    <button
                      onClick={() => saveEdit(order._id)}
                      className="px-5 py-2 rounded-lg bg-gold text-black text-xs font-semibold hover:opacity-90 transition"
                    >
                      Save Changes
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="px-5 py-2 rounded-lg border border-white/20 text-xs hover:border-white/40 transition"
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              )}

              {/* BODY */}
              <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-6 pt-5">

                {/* ADDRESS */}
                <div className="bg-black/30 border border-white/10 rounded-xl p-4">

                  <p className="text-gold text-xs font-semibold uppercase tracking-wide mb-2">
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

                        <p className="text-sm font-semibold text-gold shrink-0">
                          ₹{product.quantity * product.price}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* FOOTER */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-5 mt-5 border-t border-white/10">

                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      editingId === order._id
                        ? setEditingId(null)
                        : startEdit(order)
                    }
                    className="px-4 py-2 rounded-lg border border-white/20 text-xs hover:border-gold transition"
                  >
                    {editingId === order._id ? "Close Edit" : "Edit"}
                  </button>

                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="px-4 py-2 rounded-lg border border-red-500/40 text-red-400 text-xs hover:bg-red-500/10 transition"
                  >
                    Delete
                  </button>

                </div>

                <div className="flex items-center gap-3">

                  <span className="text-sm text-gray-400">
                    Total Amount
                  </span>

                  <span className="text-2xl font-bold text-gold">
                    ₹{order.totalAmount}
                  </span>

                </div>

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

}