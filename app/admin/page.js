"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const statusColor = {
  Pending: "text-yellow-400",
  Delivered: "text-green-400",
  Cancelled: "text-red-400",
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders || []);
          setLowStock(data.lowStock || []);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-white text-xl">Loading dashboard...</div>
    );
  }

  const cards = [
    {
      label: "Total Revenue",
      value: `₹${(stats?.revenue || 0).toLocaleString("en-IN")}`,
      accent: "text-[#D4AF37]",
    },
    {
      label: "This Month",
      value: `₹${(stats?.monthRevenue || 0).toLocaleString("en-IN")}`,
      accent: "text-[#D4AF37]",
    },
    {
      label: "Total Orders",
      value: stats?.orders || 0,
      accent: "text-white",
    },
    {
      label: "Pending Orders",
      value: stats?.pending || 0,
      accent: "text-yellow-400",
    },
    {
      label: "Delivered",
      value: stats?.delivered || 0,
      accent: "text-green-400",
    },
    {
      label: "Cancelled",
      value: stats?.cancelled || 0,
      accent: "text-red-400",
    },
    {
      label: "Customers",
      value: stats?.customers || 0,
      accent: "text-white",
    },
    {
      label: "Products",
      value: stats?.products || 0,
      accent: "text-white",
    },
  ];

  return (
    <div className="p-8 text-white space-y-10">
      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/40 transition"
          >
            <p className="text-gray-400 text-sm mb-2">{card.label}</p>
            <p className={`text-3xl font-bold ${card.accent}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT ORDERS */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-[#D4AF37] text-sm hover:underline"
            >
              View All →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-400">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-white/10">
                    <th className="py-3 pr-4">Order ID</th>
                    <th className="py-3 pr-4">Customer</th>
                    <th className="py-3 pr-4">Amount</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr
                      key={o._id}
                      className="border-b border-white/5"
                    >
                      <td className="py-3 pr-4 text-[#D4AF37]">
                        {o.orderId || o._id.slice(-6)}
                      </td>
                      <td className="py-3 pr-4">{o.customerName}</td>
                      <td className="py-3 pr-4">
                        ₹{(o.totalAmount || 0).toLocaleString("en-IN")}
                      </td>
                      <td
                        className={`py-3 pr-4 font-semibold ${
                          statusColor[o.orderStatus] || "text-gray-300"
                        }`}
                      >
                        {o.orderStatus}
                      </td>
                      <td className="py-3 text-gray-400">
                        {new Date(o.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* LOW STOCK */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-5">Low Stock Alerts</h2>

          {lowStock.length === 0 ? (
            <p className="text-gray-400">All products well stocked ✅</p>
          ) : (
            <div className="space-y-4">
              {lowStock.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between border border-white/10 rounded-xl px-4 py-3"
                >
                  <span className="text-sm">{p.name}</span>
                  <span
                    className={`text-sm font-bold ${
                      p.stock === 0 ? "text-red-400" : "text-yellow-400"
                    }`}
                  >
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
