"use client";

import {
  getTierSteps,
  getPricingBenefits,
  describeTierReward,
} from "../lib/pricing";

/* "SPEND MORE, SAVE MORE" PROGRESS
   Brand gold throughout: a gold line fills as the cart grows, reached
   offers are ticked, the next one is outlined, later ones stay dim.

   withMessage adds the plain-words line above the bar ("Add ₹300 more
   to unlock Free Shipping"), in the same gold box the checkout uses. */

export default function OccasionTierTrack({
  tiers,
  total,
  size = "lg",
  withMessage = false,
  /* "start": centred on phones, left-aligned on desktop */
  align = "center",
}) {

  const steps = getTierSteps(total, tiers);

  if (steps.length === 0) return null;

  const amount = Number(total) || 0;

  const lastMin = Math.max(...steps.map((s) => Number(s.minAmount) || 0));

  const fillPercent = lastMin > 0
    ? Math.min((amount / lastMin) * 100, 100)
    : 0;

  const compact = size === "sm";

  const offer = getPricingBenefits(amount, tiers);

  const unlockedReward = [
    offer.freeShipping && "Free Shipping",
    offer.discountPercent > 0 && `${offer.discountPercent}% OFF`,
  ]
    .filter(Boolean)
    .join(" + ");

  const track = (

    <>

      {/* PROGRESS LINE */}
      <div
        className={`relative w-full ${compact ? "h-1.5" : "h-1.5"} rounded-full bg-white/10 overflow-hidden`}
      >

        <div
          className="h-full rounded-full bg-gold transition-[width] duration-700 ease-out"
          style={{ width: `${fillPercent}%` }}
        />

      </div>

      {/* CHECKPOINTS — only useful when there is more than one offer */}
      {(steps.length > 1 || !withMessage) && (

        <div
          className={`flex flex-wrap items-center gap-2 ${compact ? "mt-3" : "mt-4"} ${
            withMessage
              ? "justify-start"
              : align === "start"
              ? "justify-center lg:justify-start"
              : "justify-center"
          }`}
        >

          {steps.map((step, i) => (

            <div
              key={i}
              className={`flex items-center gap-1.5 rounded-full border transition-colors duration-300 ${
                compact ? "px-2.5 py-1 text-[10px]" : "px-4 py-2 text-xs sm:text-sm"
              } ${
                step.unlocked
                  ? "border-gold bg-gold/15 text-gold font-semibold"
                  : step.isNext
                  ? "border-gold/60 text-gold font-semibold"
                  : "border-white/15 text-white/40"
              }`}
            >

              <span>{step.unlocked ? "✓" : "₹" + step.minAmount}</span>

              <span>{describeTierReward(step)}</span>

            </div>

          ))}

        </div>

      )}

    </>

  );

  if (!withMessage) {

    return <div className="w-full">{track}</div>;

  }

  return (

    <div className="w-full border border-gold/40 bg-gold/10 rounded-2xl px-4 py-4">

      <p className="text-sm font-semibold text-gold mb-3">

        {offer.nextTier ? (
          <>
            ✦ Add ₹{Math.max(Math.ceil(offer.nextTier.minAmount - amount), 0)}{" "}
            more to unlock {describeTierReward(offer.nextTier)}
          </>
        ) : (
          <>🎉 You&apos;ve unlocked {unlockedReward || "every offer"}</>
        )}

      </p>

      {track}

      {offer.nextTier && unlockedReward && (

        <p className="mt-3 text-xs text-green-400">
          ✓ Already unlocked: {unlockedReward}
        </p>

      )}

    </div>

  );

}
