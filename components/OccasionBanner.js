"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { getCartTotal } from "../lib/cart";
import { getPricingBenefits, describeTierReward } from "../lib/pricing";
import OccasionTierTrack from "./OccasionTierTrack";

/* FESTIVE CAMPAIGN BANNER — the occasion campaign (title, tagline, emoji,
   image) set by admin in /admin/settings, with a live "spend more, save
   more" progress line driven by the visitor's actual cart.

   Desktop: the offer on the left; on the right the campaign image in a
   gold frame (or a gold medallion with the emoji) and a gold "ticket"
   stating the reward. Phones: one compact centred column.

   `initialSettings` comes from the server so the banner is present in
   the first paint (no pop-in, and the hero below can size itself to
   share the screen). It falls back to fetching if not supplied. */

/* warm, blurred festive lights drifting behind everything */
const LIGHTS = [
  { top: "8%", left: "4%", size: 90, delay: "0s" },
  { top: "60%", left: "12%", size: 140, delay: "2s" },
  { top: "18%", left: "38%", size: 60, delay: "4s" },
  { top: "70%", left: "46%", size: 80, delay: "1s" },
  { top: "6%", left: "70%", size: 120, delay: "3s" },
  { top: "55%", left: "86%", size: 100, delay: "5s" },
];

/* small gold stars that twinkle (position, size, delay) */
const SPARKS = [
  { top: "14%", left: "6%", size: 10, delay: "0s" },
  { top: "22%", left: "90%", size: 14, delay: "1.1s" },
  { top: "64%", left: "8%", size: 8, delay: "2.2s" },
  { top: "78%", left: "94%", size: 10, delay: "0.6s" },
  { top: "8%", left: "52%", size: 7, delay: "1.7s" },
  { top: "88%", left: "34%", size: 7, delay: "2.7s" },
  { top: "42%", left: "97%", size: 6, delay: "0.3s" },
  { top: "40%", left: "3%", size: 6, delay: "1.4s" },
];

const CORNERS = [
  "top-0 left-0 border-t border-l",
  "top-0 right-0 border-t border-r",
  "bottom-0 left-0 border-b border-l",
  "bottom-0 right-0 border-b border-r",
];

function Corners({ size = "w-4 h-4 sm:w-5 sm:h-5" }) {

  return CORNERS.map((corner) => (
    <span
      key={corner}
      aria-hidden="true"
      className={`absolute ${size} -m-px border-gold ${corner}`}
    />
  ));

}

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

  const activeTiers = tiers
    .filter((t) => t && t.active !== false)
    .sort((a, b) => Number(a.minAmount) - Number(b.minAmount));

  if (!campaign?.enabled || activeTiers.length === 0) return null;

  const benefits = getPricingBenefits(total, tiers);

  /* the ticket shows the best reward on offer */
  const topTier = activeTiers[activeTiers.length - 1];

  const gold = (text) => <span className="text-gold font-normal">{text}</span>;

  const message = benefits.nextTier
    ? (
      total === 0 ? (
        <>
          Spend {gold(`₹${benefits.nextTier.minAmount}`)} and enjoy{" "}
          {gold(describeTierReward(benefits.nextTier))}
        </>
      ) : (
        <>
          Add {gold(`₹${Math.max(benefits.nextTier.minAmount - total, 0)}`)} more
          to enjoy {gold(describeTierReward(benefits.nextTier))}
        </>
      )
    )
    : (
      <>
        You&apos;ve unlocked{" "}
        {gold(
          describeTierReward({
            freeShipping: benefits.freeShipping,
            discountPercent: benefits.discountPercent,
          })
        )}
      </>
    );

  const emoji = campaign.emoji ? (
    <span aria-hidden="true" className="text-base sm:text-lg tracking-normal">
      {campaign.emoji}
    </span>
  ) : null;

  return (

    <section
      aria-label={campaign.title || "Festive offer"}
      className="relative w-full overflow-hidden bg-black"
    >

      {/* GLOW AND FESTIVE LIGHTS */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_90%_at_30%_0%,rgba(212,175,55,0.2),transparent_70%)]" />

      {LIGHTS.map((l, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="festive-light"
          style={{
            top: l.top,
            left: l.left,
            width: l.size,
            height: l.size,
            "--d": l.delay,
          }}
        />
      ))}

      {/* BOTTOM FADE — blends into the page below without a hard seam */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[var(--background)] pointer-events-none" />

      {/* CONTENT, inside a double gold frame */}
      <div className="relative px-4 sm:px-6 py-6 sm:py-8">

        <div className="relative max-w-6xl mx-auto border border-gold/30 px-6 py-9 sm:px-12 sm:py-12 lg:px-14 lg:py-14">

          <span
            aria-hidden="true"
            className="absolute inset-1.5 sm:inset-2 border border-gold/10 pointer-events-none"
          />

          <span
            aria-hidden="true"
            className="festive-sweep absolute top-[-1px] left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent pointer-events-none"
          />

          {SPARKS.map((s, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="festive-spark"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                "--d": s.delay,
              }}
            />
          ))}

          <Corners />

          {/* Phones: heading, then the visual and ticket, then the progress
              and button. Desktop: text on the left, visual on the right. */}
          <div className="relative grid lg:grid-cols-[1.15fr_1fr] gap-x-14 gap-y-8 lg:gap-y-0 items-center">

            {/* HEADING AND OFFER LINE */}
            <div className="text-center lg:text-left lg:col-start-1 lg:row-start-1 lg:self-end">

              <p className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 uppercase tracking-[0.3em] sm:tracking-[0.35em] text-gold text-[10px] sm:text-xs mb-4 sm:mb-5">

                <span aria-hidden="true" className="w-5 sm:w-10 h-px bg-gradient-to-r from-transparent to-gold" />

                {emoji}

                <span>{campaign.tagline || "A Limited Season"}</span>

                {emoji}

                <span aria-hidden="true" className="w-5 sm:w-10 h-px bg-gradient-to-l from-transparent to-gold lg:hidden" />

              </p>

              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05] mb-5 sm:mb-6">

                <span className="accent accent-shimmer">{campaign.title}</span>

              </h2>

              <div
                aria-hidden="true"
                className="flex items-center justify-center lg:justify-start gap-3 mb-5 sm:mb-6"
              >
                <span className="w-12 h-px bg-gradient-to-r from-transparent to-gold/70 lg:hidden" />
                <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
                <span className="w-16 h-px bg-gradient-to-l from-transparent to-gold/70 lg:bg-gradient-to-r lg:from-gold/70 lg:to-transparent" />
              </div>

              <p className="text-white/80 font-light text-base sm:text-lg">

                {message}

              </p>

            </div>

            {/* VISUAL AND REWARD TICKET */}
            <div className="relative flex justify-center pb-12 lg:pb-10 lg:col-start-2 lg:row-start-1 lg:row-span-2">

              {campaign.image ? (

                <div className="relative w-full max-w-[15rem] sm:max-w-xs lg:max-w-sm aspect-[4/5] border border-gold/40 shadow-[0_0_80px_rgba(212,175,55,0.18)]">

                  <div
                    className="absolute inset-1.5 sm:inset-2 bg-cover bg-center"
                    style={{ backgroundImage: `url(${campaign.image})` }}
                  />

                  <Corners size="w-5 h-5 sm:w-6 sm:h-6" />

                </div>

              ) : (

                <div aria-hidden="true" className="relative w-52 h-52 sm:w-60 sm:h-60 lg:w-72 lg:h-72">

                  <span className="absolute inset-0 rounded-full border border-gold/30" />
                  <span className="festive-spin absolute inset-3 lg:inset-4 rounded-full border border-dashed border-gold/45" />
                  <span className="absolute inset-8 lg:inset-10 rounded-full border border-gold/25 bg-[radial-gradient(circle,rgba(212,175,55,0.28),transparent_70%)]" />
                  <span className="absolute inset-0 flex items-center justify-center text-6xl lg:text-7xl">
                    {campaign.emoji || "✦"}
                  </span>

                </div>

              )}

              {/* the reward, as a gold ticket with cut-out edges. Always
                  dark text on gold, in either theme. */}
              <div className="festive-ticket absolute bottom-0 left-1/2 -translate-x-1/2 -rotate-3 w-max max-w-[15rem] sm:max-w-[17rem] px-8 sm:px-10 py-3 sm:py-4 text-center">

                <p className="uppercase tracking-[0.3em] text-[9px] sm:text-[10px] mb-1 opacity-75">
                  Festive Privilege
                </p>

                <p className="text-lg sm:text-xl font-light leading-snug">
                  {describeTierReward(topTier)}
                </p>

                <p className="text-[11px] sm:text-xs mt-1 opacity-75">
                  on orders above ₹{topTier.minAmount}
                </p>

              </div>

            </div>

            {/* PROGRESS AND BUTTON */}
            <div className="text-center lg:text-left lg:col-start-1 lg:row-start-2 lg:self-start lg:pt-8">

              <div className="max-w-md mx-auto lg:mx-0 mb-7 sm:mb-9">

                <OccasionTierTrack tiers={tiers} total={total} size="sm" align="start" />

              </div>

              <Link
                href="/shop"
                className="btn-gold group inline-flex items-center gap-3 bg-gold text-black px-9 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-[0.25em] font-medium transition-colors duration-300"
              >
                Shop the Collection
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}
