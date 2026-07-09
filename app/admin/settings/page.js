"use client";

import { useEffect, useState } from "react";

const fields = [
  { name: "storeName", label: "Store Name", type: "text" },
  { name: "supportEmail", label: "Support Email", type: "email" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "whatsapp", label: "WhatsApp Number", type: "text" },
  { name: "address", label: "Address", type: "text" },
  { name: "instagram", label: "Instagram URL", type: "text" },
  { name: "shippingFee", label: "Shipping Fee (₹)", type: "number" },
  {
    name: "freeShippingAbove",
    label: "Free Shipping Above (₹, 0 = always free)",
    type: "number",
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success) setSettings(data.settings);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  async function saveSettings(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      setMessage(
        data.success ? "Settings saved ✅" : data.error || "Save failed"
      );
    } catch (err) {
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-10 text-white text-xl">Loading settings...</div>;
  }

  if (!settings) {
    return <div className="p-10 text-white">Failed to load settings.</div>;
  }

  return (
    <div className="text-white max-w-3xl">
      <p className="text-gray-400 mb-8">
        Store information and checkout options.
      </p>

      <form
        onSubmit={saveSettings}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5"
      >
        {fields.map((f) => (
          <div key={f.name}>
            <label className="block text-sm text-gray-400 mb-1.5">
              {f.label}
            </label>
            <input
              type={f.type}
              value={settings[f.name] ?? ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  [f.name]:
                    f.type === "number"
                      ? Number(e.target.value)
                      : e.target.value,
                })
              }
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/60"
            />
          </div>
        ))}

        {/* COD TOGGLE */}
        <div className="flex items-center justify-between border border-white/10 rounded-xl px-4 py-3">
          <span className="text-sm">Cash on Delivery (COD)</span>
          <button
            type="button"
            onClick={() =>
              setSettings({ ...settings, codEnabled: !settings.codEnabled })
            }
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              settings.codEnabled
                ? "bg-green-500/20 text-green-400 border border-green-500/40"
                : "bg-red-500/20 text-red-400 border border-red-500/40"
            }`}
          >
            {settings.codEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>

        <div className="flex items-center gap-5 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#D4AF37] text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>

          {message && (
            <span className="text-sm text-gray-300">{message}</span>
          )}
        </div>
      </form>
    </div>
  );
}
