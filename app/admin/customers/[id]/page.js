"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const statusColor = {
  Pending: "text-yellow-400",
  Delivered: "text-green-400",
  Cancelled: "text-red-400",
};

export default function CustomerDetailPage() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [custRes, ordersRes] = await Promise.all([
          fetch(`/api/customers/${id}`),
          fetch("/api/orders"),
        ]);

        const custData = await custRes.json();
        const ordersData = await ordersRes.json();

        if (custData.success) setCustomer(custData.customer);

        if (ordersData.success) {
          setOrders(
            (ordersData.orders || []).filter(
              (o) => o.customerId === id
            )
          );
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-white text-xl">Loading customer...</div>;
  }

  if (!customer) {
    return (
      <div className="p-10 text-white">
        <p className="mb-4">Customer not found.</p>
        <Link href="/admin/customers" className="text-[#D4AF37] hover:underline">
          ← Back to Customers
        </Link>
      </div>
    );
  }

  const info = [
    { label: "Mobile", value: customer.mobile },
    { label: "Email", value: customer.email },
    { label: "City", value: customer.city },
    { label: "State", value: customer.state },
    { label: "Address", value: customer.address },
    {
      label: "Last Order",
      value: customer.lastOrderDate
        ? new Date(customer.lastOrderDate).toLocaleDateString("en-IN")
        : "-",
    },
  ];

  return (
    <div className="p-8 text-white space-y-8">
      <Link
        href="/admin/customers"
        className="text-[#D4AF37] text-sm hover:underline"
      >
        ← Back to Customers
      </Link>

      {/* PROFILE HEADER */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-[#D4AF37] text-sm mb-1">
              {customer.customerId}
            </p>
            <h1 className="text-4xl font-bold">{customer.name}</h1>
          </div>

          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#D4AF37]">
                {customer.totalOrders || 0}
              </p>
              <p className="text-gray-400 text-sm">Orders</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#D4AF37]">
                ₹{(customer.totalSpent || 0).toLocaleString("en-IN")}
              </p>
              <p className="text-gray-400 text-sm">Total Spent</p>
            </div>
          </div>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {info.map((item) => (
            <div
              key={item.label}
              className="border border-white/10 rounded-xl px-4 py-3"
            >
              <p className="text-gray-400 text-xs mb-1">{item.label}</p>
              <p className="text-sm">{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ORDER HISTORY */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-5">Order History</h2>

        {orders.length === 0 ? (
          <p className="text-gray-400">No orders found for this customer.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="py-3 pr-4">Order ID</th>
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Items</th>
                  <th className="py-3 pr-4">Amount</th>
                  <th className="py-3 pr-4">Payment</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-white/5">
                    <td className="py-3 pr-4 text-[#D4AF37]">
                      {o.orderId || o._id.slice(-6)}
                    </td>
                    <td className="py-3 pr-4 text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3 pr-4">
                      {(o.products || [])
                        .map((p) => `${p.name} ×${p.quantity}`)
                        .join(", ")}
                    </td>
                    <td className="py-3 pr-4">
                      ₹{(o.totalAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 pr-4">{o.paymentMethod || "-"}</td>
                    <td
                      className={`py-3 font-semibold ${
                        statusColor[o.orderStatus] || "text-gray-300"
                      }`}
                    >
                      {o.orderStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
