"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  code: "",
  discountType: "percent",
  value: "",
  minOrder: "",
  expiresAt: "",
};

export default function MarketingPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchCoupons() {
    try {
      const res = await fetch("/api/coupons");
      const data = await res.json();
      if (data.success) setCoupons(data.coupons || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function createCoupon(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setForm(emptyForm);
        setMessage("Coupon created ✅");
        fetchCoupons();
      } else {
        setMessage(data.error || "Failed to create coupon");
      }
    } catch (err) {
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(coupon) {
    await fetch(`/api/coupons/${coupon._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !coupon.active }),
    });
    fetchCoupons();
  }

  async function deleteCoupon(id) {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    fetchCoupons();
  }

  return (
    <div className="p-8 text-white space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Marketing</h1>
        <p className="text-gray-400">
          Create and manage discount coupons for your store.
        </p>
      </div>

      {/* CREATE COUPON */}
      <form
        onSubmit={createCoupon}
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold mb-5">Create Coupon</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
            placeholder="Code e.g. WELCOME10"
            required
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/60"
          />

          <select
            value={form.discountType}
            onChange={(e) =>
              setForm({ ...form, discountType: e.target.value })
            }
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/60"
          >
            <option value="percent">Percent (%)</option>
            <option value="flat">Flat (₹)</option>
          </select>

          <input
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            placeholder={
              form.discountType === "percent" ? "e.g. 10" : "e.g. 200"
            }
            type="number"
            min="1"
            required
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/60"
          />

          <input
            value={form.minOrder}
            onChange={(e) =>
              setForm({ ...form, minOrder: e.target.value })
            }
            placeholder="Min order ₹ (optional)"
            type="number"
            min="0"
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/60"
          />

          <input
            value={form.expiresAt}
            onChange={(e) =>
              setForm({ ...form, expiresAt: e.target.value })
            }
            type="date"
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/60"
          />
        </div>

        <div className="flex items-center gap-5 mt-5">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#D4AF37] text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Coupon"}
          </button>

          {message && (
            <span className="text-sm text-gray-300">{message}</span>
          )}
        </div>
      </form>

      {/* COUPON LIST */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-5">All Coupons</h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : coupons.length === 0 ? (
          <p className="text-gray-400">
            No coupons yet. Create your first one above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="py-3 pr-4">Code</th>
                  <th className="py-3 pr-4">Discount</th>
                  <th className="py-3 pr-4">Min Order</th>
                  <th className="py-3 pr-4">Expires</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id} className="border-b border-white/5">
                    <td className="py-3 pr-4 text-[#D4AF37] font-semibold">
                      {c.code}
                    </td>
                    <td className="py-3 pr-4">
                      {c.discountType === "percent"
                        ? `${c.value}%`
                        : `₹${c.value}`}
                    </td>
                    <td className="py-3 pr-4">
                      {c.minOrder ? `₹${c.minOrder}` : "-"}
                    </td>
                    <td className="py-3 pr-4 text-gray-400">
                      {c.expiresAt
                        ? new Date(c.expiresAt).toLocaleDateString("en-IN")
                        : "Never"}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={
                          c.active ? "text-green-400" : "text-red-400"
                        }
                      >
                        {c.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 flex gap-3">
                      <button
                        onClick={() => toggleActive(c)}
                        className="px-3 py-1.5 rounded-lg border border-white/20 text-xs hover:border-[#D4AF37] transition"
                      >
                        {c.active ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => deleteCoupon(c._id)}
                        className="px-3 py-1.5 rounded-lg border border-red-500/40 text-red-400 text-xs hover:bg-red-500/10 transition"
                      >
                        Delete
                      </button>
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
