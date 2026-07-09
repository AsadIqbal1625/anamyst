"use client";

import { useEffect, useState } from "react";

function printInvoice(order) {
  const rows = (order.products || [])
    .map(
      (p) => `
      <tr>
        <td>${p.name}</td>
        <td style="text-align:center">${p.quantity}</td>
        <td style="text-align:right">₹${p.price}</td>
        <td style="text-align:right">₹${p.price * p.quantity}</td>
      </tr>`
    )
    .join("");

  const html = `
  <html>
    <head>
      <title>Invoice ${order.invoiceId || order.orderId || ""}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #111; padding: 40px; }
        .brand { font-size: 28px; letter-spacing: 6px; font-weight: bold; }
        .gold { color: #b8860b; }
        table { width: 100%; border-collapse: collapse; margin-top: 24px; }
        th, td { border-bottom: 1px solid #ddd; padding: 10px 6px; font-size: 14px; }
        th { text-align: left; background: #f7f7f7; }
        .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
        .meta { margin-top: 24px; font-size: 14px; line-height: 1.7; }
        .head { display: flex; justify-content: space-between; align-items: flex-start; }
      </style>
    </head>
    <body>
      <div class="head">
        <div>
          <div class="brand">ANAMYST</div>
          <div class="gold">Luxury Fragrances</div>
          <div style="font-size:13px;margin-top:6px">
            Lucknow, Uttar Pradesh, India<br/>
            team@anamyst.com
          </div>
        </div>
        <div style="text-align:right;font-size:14px">
          <b>INVOICE</b><br/>
          Invoice: ${order.invoiceId || "-"}<br/>
          Order: ${order.orderId || "-"}<br/>
          Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}
        </div>
      </div>

      <div class="meta">
        <b>Billed To:</b><br/>
        ${order.customerName}<br/>
        ${order.address || ""}, ${order.city || ""} ${order.pincode || ""}<br/>
        ${order.phone || ""} · ${order.email || ""}
      </div>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th style="text-align:center">Qty</th>
            <th style="text-align:right">Price</th>
            <th style="text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div class="total">Grand Total: ₹${order.totalAmount}</div>
      <div style="font-size:13px;margin-top:8px;text-align:right">
        Payment: ${order.paymentMethod || "-"} (${order.paymentStatus || "-"})
      </div>

      <p style="margin-top:40px;font-size:12px;color:#777">
        Thank you for shopping with ANAMYST.
      </p>
      <script>window.print();</script>
    </body>
  </html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
}

export default function InvoicesPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) setOrders(data.orders || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      !q ||
      o.invoiceId?.toLowerCase().includes(q) ||
      o.orderId?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <div className="p-10 text-white text-xl">Loading invoices...</div>;
  }

  return (
    <div className="text-white">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Invoice ID, Order ID or Customer..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm outline-none focus:border-[#D4AF37]/60"
        />

        <a
          href="/api/invoices/export"
          className="bg-white/10 border border-[#D4AF37]/40 hover:bg-white/20 text-white px-5 py-3 rounded-xl text-sm font-semibold transition whitespace-nowrap"
        >
          Download Invoices (Excel)
        </a>

      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400">No invoices found.</p>
      ) : (
        <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-white/10">
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Order Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o._id} className="border-b border-white/5">
                  <td className="p-4 text-[#D4AF37]">
                    {o.invoiceId || "-"}
                  </td>
                  <td className="p-4">{o.orderId || "-"}</td>
                  <td className="p-4">{o.customerName}</td>
                  <td className="p-4 text-gray-400">
                    {new Date(o.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="p-4">
                    ₹{(o.totalAmount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="p-4">
                    <span
                      className={
                        o.paymentStatus === "Paid"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }
                    >
                      {o.paymentMethod || "-"} · {o.paymentStatus || "-"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={
                        o.orderStatus === "Delivered"
                          ? "text-green-400"
                          : o.orderStatus === "Cancelled"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }
                    >
                      {o.orderStatus || "-"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => printInvoice(o)}
                      className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:opacity-90 transition"
                    >
                      Print / PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
