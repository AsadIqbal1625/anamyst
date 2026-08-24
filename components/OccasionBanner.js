"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { getCartTotal } from "../lib/cart";
import { getPricingBenefits, describeTierReward } from "../lib/pricing";
import OccasionTierTrack from "./OccasionTierTrack";

/* FESTIVE HERO BANNER — the occasion campaign (title, tagline, image)
   set by admin in /admin/settings, combined with a live "spend more,
   save more" progress track driven by the visitor's actual cart.

   `initialSettings` comes from the server so the banner is present in
   the first paint (no pop-in, and the hero below can size itself to
   share the screen). It falls back to fetching if not supplied. */

export default function OccasionBanner({ initialSettings = null }) {

  const [settings, setSettings] = useState(initialSettings);

  const [total, setTotal] = useState(0);

  useEffect(() => {

    setTotal(getCartTotal());

    if (!initialSettings) {

      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {

          if (data.success) setSettings(data.settings);

        })
        .catch(() => {});

    }

    const onCartUpdate = () => setTotal(getCartTotal());

    window.addEventListener("cartUpdated", onCartUpdate);

    return () =>
      window.removeEventListener("cartUpdated", onCartUpdate);

  }, [initialSettings]);

  if (!settings) return null;

  const campaign = settings.campaign;

  const tiers = settings.discountTiers || [];

  const activeTiers = tiers.filter((t) => t && t.active !== false);

  if (!campaign?.enabled || activeTiers.length === 0) return null;

  const benefits = getPricingBenefits(total, tiers);

  const message = benefits.nextTier
    ? (
      total === 0 ? (
        <>Spend <span className="font-bold">₹{benefits.nextTier.minAmount}</span> &amp; get{" "}
        <span className="font-bold">{describeTierReward(benefits.nextTier)}</span> — unlock more offers!</>
      ) : (
        <>Add <span className="font-bold">₹{Math.max(benefits.nextTier.minAmount - total, 0)}</span> more to unlock{" "}
        <span className="font-bold">{describeTierReward(benefits.nextTier)}</span>!</>
      )
    )
    : (
      <>🎉 You&apos;ve unlocked{" "}
      <span className="font-bold">
        {describeTierReward({ freeShipping: benefits.freeShipping, discountPercent: benefits.discountPercent })}
      </span>!</>
    );

  return (

    <section className="relative w-full overflow-hidden border-t border-[#D4AF37]/20">

      {/* BACKGROUND */}

      {campaign.image ? (

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${campaign.image})` }}
        />

      ) : (

        <div className="absolute inset-0 bg-gradient-to-br from-[#3a1a06] via-[#7a3b0f] to-[#D4AF37]/40" />

      )}

      <div className="absolute inset-0 bg-black/70" />

      {/* GLOW ACCENTS */}

      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#FF5C7A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* BOTTOM FADE — blends into the black hero below instead of
          ending on a hard seam */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-black pointer-events-none" />

      {/* CONTENT */}

      <div className="relative px-6 pt-9 pb-12 sm:pt-14 sm:pb-16 max-w-4xl mx-auto text-center">

        <p className="uppercase tracking-[4px] text-[#D4AF37] text-[10px] sm:text-sm mb-2 sm:mb-3">

          ✦ {campaign.tagline || "Limited Time Offer"} ✦

        </p>

        <h2 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4 tracking-tight">

          {campaign.emoji}{" "}
          <span className="bg-gradient-to-r from-[#D4AF37] via-[#FF9635] to-[#FF5C7A] bg-clip-text text-transparent">

            {campaign.title}

          </span>{" "}
          {campaign.emoji}

        </h2>

        <p className="text-white/90 text-sm sm:text-xl mb-6 sm:mb-8">

          {message}

        </p>

        <div className="max-w-xl mx-auto mb-6 sm:mb-8">

          <OccasionTierTrack tiers={tiers} total={total} size="lg" />

        </div>

        <Link href="/shop">

          <button className="bg-[#D4AF37] hover:bg-[#c19b2e] text-black text-sm sm:text-base px-8 py-3 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 font-semibold tracking-wide">

            Shop Now

          </button>

        </Link>

      </div>

    </section>

  );

}
