"use client";

import { useEffect, useState } from "react";

import { compressImage } from "../../../lib/compressImage";

const fields = [
  { name: "storeName", label: "Store Name", type: "text" },
  { name: "supportEmail", label: "Support Email", type: "email" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "whatsapp", label: "WhatsApp Number", type: "text" },
  { name: "address", label: "Address", type: "text" },
  { name: "instagram", label: "Instagram URL", type: "text" },
  { name: "shippingFee", label: "Shipping Fee (₹, charged below the lowest active free-shipping tier)", type: "number" },
  { name: "codFee", label: "Cash on Delivery Fee (₹, added to COD orders only)", type: "number" },
];

const emptyTier = {
  label: "",
  minAmount: 0,
  discountPercent: 0,
  freeShipping: false,
  active: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadingBanner, setUploadingBanner] = useState(false);

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

  function updateCampaign(patch) {
    setSettings({
      ...settings,
      campaign: { ...(settings.campaign || {}), ...patch },
    });
  }

  async function uploadBannerImage(file) {
    if (!file) return;
    setUploadingBanner(true);
    try {
      /* the banner spans the full viewport width, so it needs more
         resolution than the 1600px default used for product photos */
      const compressed = await compressImage(file, {
        maxDimension: 2400,
        quality: 0.8,
      });
      const formData = new FormData();
      formData.append("file", compressed);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        updateCampaign({ image: data.imageUrl });
      } else {
        setMessage(data.error || "Image upload failed");
      }
    } catch (err) {
      setMessage("Image upload failed");
    } finally {
      setUploadingBanner(false);
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
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60"
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

        {/* OCCASION CAMPAIGN (homepage hero banner) */}
        <div className="border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold">Occasion Campaign</p>
              <p className="text-xs text-gray-500 mt-1">
                Festive banner shown at the top of the homepage (e.g.
                &quot;DIWALI OFFER&quot;) — combines your headline with the
                live discount-tier progress below.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updateCampaign({ enabled: !settings.campaign?.enabled })
              }
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                settings.campaign?.enabled
                  ? "bg-green-500/20 text-green-400 border border-green-500/40"
                  : "bg-red-500/20 text-red-400 border border-red-500/40"
              }`}
            >
              {settings.campaign?.enabled ? "Enabled" : "Disabled"}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                Emoji
              </label>
              <input
                type="text"
                placeholder="🪔"
                value={settings.campaign?.emoji ?? ""}
                onChange={(e) => updateCampaign({ emoji: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold/60"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] text-gray-500 mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="DIWALI OFFER"
                value={settings.campaign?.title ?? ""}
                onChange={(e) => updateCampaign({ title: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold/60"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[11px] text-gray-500 mb-1">
              Tagline
            </label>
            <input
              type="text"
              placeholder="On this auspicious occasion"
              value={settings.campaign?.tagline ?? ""}
              onChange={(e) => updateCampaign({ tagline: e.target.value })}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold/60"
            />
          </div>

          <div>
            <label className="block text-[11px] text-gray-500 mb-1">
              Banner Image (optional — falls back to a festive gradient)
            </label>

            <p className="text-[11px] text-gray-600 mb-2">
              Best size: <span className="text-gray-400">2400 × 1000 px</span>{" "}
              (wide 2.4:1). The image is centre-cropped to fit each screen, so
              keep diyas, products and any focal point in the middle — the
              outer edges get cut on mobile and the top/bottom get cut on
              desktop. Don&apos;t put text in the image; the title and tagline
              above are drawn over it.
            </p>

            {settings.campaign?.image && (
              <div className="relative mb-3 rounded-xl overflow-hidden border border-white/10">
                <img
                  src={settings.campaign.image}
                  alt="Campaign banner"
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => updateCampaign({ image: "" })}
                  className="absolute top-2 right-2 bg-black/70 text-red-400 text-[11px] font-semibold px-3 py-1 rounded-lg hover:bg-black transition"
                >
                  Remove
                </button>
              </div>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              disabled={uploadingBanner}
              onChange={(e) => uploadBannerImage(e.target.files?.[0])}
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gold/20 file:text-gold file:text-xs file:font-semibold"
            />

            {uploadingBanner && (
              <p className="text-xs text-gray-500 mt-1">Uploading...</p>
            )}
          </div>
        </div>

        {/* DISCOUNT TIERS */}
        <div className="border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold">Discount Tiers</p>
              <p className="text-xs text-gray-500 mt-1">
                Auto-applied on cart total — no coupon code needed. Use
                this for occasion offers (Diwali, Holi, etc.) — just edit
                the label and numbers, or toggle a tier off when the
                occasion ends.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings({
                  ...settings,
                  discountTiers: [
                    ...(settings.discountTiers || []),
                    { ...emptyTier },
                  ],
                })
              }
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-gold/20 text-gold border border-gold/40 hover:bg-gold/30 transition whitespace-nowrap"
            >
              + Add Tier
            </button>
          </div>

          <div className="space-y-3">
            {(settings.discountTiers || []).map((tier, i) => (
              <div
                key={i}
                className="bg-black/40 border border-white/10 rounded-xl p-3 grid grid-cols-2 md:grid-cols-5 gap-3 items-end"
              >
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[11px] text-gray-500 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Diwali Sale"
                    value={tier.label}
                    onChange={(e) => {
                      const tiers = [...settings.discountTiers];
                      tiers[i] = { ...tier, label: e.target.value };
                      setSettings({ ...settings, discountTiers: tiers });
                    }}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold/60"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">
                    Min. Cart (₹)
                  </label>
                  <input
                    type="number"
                    value={tier.minAmount}
                    onChange={(e) => {
                      const tiers = [...settings.discountTiers];
                      tiers[i] = {
                        ...tier,
                        minAmount: Number(e.target.value),
                      };
                      setSettings({ ...settings, discountTiers: tiers });
                    }}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold/60"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={tier.discountPercent}
                    onChange={(e) => {
                      const tiers = [...settings.discountTiers];
                      tiers[i] = {
                        ...tier,
                        discountPercent: Number(e.target.value),
                      };
                      setSettings({ ...settings, discountTiers: tiers });
                    }}
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold/60"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!tier.freeShipping}
                      onChange={(e) => {
                        const tiers = [...settings.discountTiers];
                        tiers[i] = {
                          ...tier,
                          freeShipping: e.target.checked,
                        };
                        setSettings({ ...settings, discountTiers: tiers });
                      }}
                      className="w-4 h-4 accent-gold"
                    />
                    Free Ship
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const tiers = [...settings.discountTiers];
                      tiers[i] = { ...tier, active: !tier.active };
                      setSettings({ ...settings, discountTiers: tiers });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                      tier.active
                        ? "bg-green-500/20 text-green-400 border border-green-500/40"
                        : "bg-red-500/20 text-red-400 border border-red-500/40"
                    }`}
                  >
                    {tier.active ? "Active" : "Off"}
                  </button>
                </div>

                <div className="flex justify-end col-span-2 md:col-span-1">
                  <button
                    type="button"
                    onClick={() => {
                      const tiers = settings.discountTiers.filter(
                        (_, idx) => idx !== i
                      );
                      setSettings({ ...settings, discountTiers: tiers });
                    }}
                    className="text-red-400/80 hover:text-red-400 text-xs uppercase tracking-wide transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {(!settings.discountTiers ||
              settings.discountTiers.length === 0) && (
              <p className="text-xs text-gray-500">
                No tiers yet — click &quot;Add Tier&quot; to create one.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-5 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-gold text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
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
