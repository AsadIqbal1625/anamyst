"use client";

import { useEffect, useState } from "react";

import { getCartTotal } from "../lib/cart";
import { getPricingBenefits, describeTierReward } from "../lib/pricing";

/* SITE-WIDE "SPEND MORE, SAVE MORE" BAR
   Shows on every storefront page (shop, product, cart, checkout — via
   the navbar) so customers see the offer while they're still browsing,
   not only after they've already committed to checkout. */

export default function TierPromoBar() {

  const [mounted, setMounted] = useState(false);

  const [settings, setSettings] = useState(null);

  const [total, setTotal] = useState(0);

  useEffect(() => {

    setMounted(true);

    setTotal(getCartTotal());

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {

        if (data.success) setSettings(data.settings);

      })
      .catch(() => {});

    const onCartUpdate = () => setTotal(getCartTotal());

    window.addEventListener("cartUpdated", onCartUpdate);

    return () =>
      window.removeEventListener("cartUpdated", onCartUpdate);

  }, []);

  if (!mounted || !settings) return null;

  const tiers = settings.discountTiers || [];

  const activeTiers = tiers.filter((t) => t && t.active !== false);

  if (activeTiers.length === 0) return null;

  const benefits = getPricingBenefits(total, tiers);

  if (
    !benefits.nextTier &&
    !benefits.freeShipping &&
    benefits.discountPercent === 0
  ) {
    return null;
  }

  const campaign = settings.campaign;

  const campaignPrefix =
    campaign?.enabled && campaign?.title
      ? `${campaign.emoji || "🎉"} ${campaign.title} — `
      : "";

  const unlocked = !benefits.nextTier;

  return (

    <div
      className={`relative z-30 border-b overflow-hidden ${
        unlocked
          ? "border-green-500/30"
          : "border-gold/30"
      }`}
      style={{
        background: unlocked
          ? "linear-gradient(90deg, rgba(34,197,94,0.18), rgba(34,197,94,0.06), rgba(34,197,94,0.18))"
          : "linear-gradient(90deg, rgba(212,175,55,0.22), rgba(255,150,53,0.12), rgba(212,175,55,0.22))",
      }}
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 text-center">

        {benefits.nextTier ? (

          <p className="text-xs sm:text-sm font-semibold tracking-wide text-gold">

            {campaignPrefix && (
              <span className="text-white">{campaignPrefix}</span>
            )}

            ✦{" "}
            {total === 0 ? (
              <>
                Spend ₹{benefits.nextTier.minAmount}+ &amp; get{" "}
              </>
            ) : (
              <>
                Add ₹
                {Math.max(benefits.nextTier.minAmount - total, 0)}{" "}
                more to unlock{" "}
              </>
            )}

            <span className="underline decoration-2 underline-offset-2">

              {describeTierReward(benefits.nextTier)}

            </span>

          </p>

        ) : (

          <p className="text-xs sm:text-sm font-bold tracking-wide text-green-400">

            🎉 {campaignPrefix && <span className="text-white">{campaignPrefix}</span>}
            You&apos;ve unlocked{" "}
            {describeTierReward({
              freeShipping: benefits.freeShipping,
              discountPercent: benefits.discountPercent,
            })}

          </p>

        )}

      </div>

    </div>

  );

}
