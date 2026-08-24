"use client";

import { getTierSteps, describeTierReward } from "../lib/pricing";

/* MULTI-STEP "SPEND MORE, SAVE MORE" TRACK
   Each tier lights up in its own color the moment the cart crosses
   it, the next unclaimed tier pulses to draw the eye, and everything
   past it stays dim — so progress reads at a glance. */

export default function OccasionTierTrack({
  tiers,
  total,
  size = "lg",
}) {

  const steps = getTierSteps(total, tiers);

  if (steps.length === 0) return null;

  const lastMin = Math.max(...steps.map((s) => Number(s.minAmount) || 0));

  const fillPercent = lastMin > 0
    ? Math.min((Number(total) / lastMin) * 100, 100)
    : 0;

  const compact = size === "sm";

  return (

    <div className="w-full">

      {/* CONNECTING PROGRESS LINE */}

      <div
        className={`relative w-full ${compact ? "h-1" : "h-1.5"} rounded-full bg-white/10 overflow-hidden`}
      >

        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${fillPercent}%`,
            background: "linear-gradient(90deg, #D4AF37, #FF9635, #FF5C7A, #22C55E)",
          }}
        />

      </div>

      {/* STEP CHIPS */}

      <div
        className={`flex flex-wrap items-center gap-2 ${compact ? "mt-2" : "mt-4"} justify-center`}
      >

        {steps.map((step, i) => (

          <div
            key={i}
            className={`flex items-center gap-1.5 rounded-full border transition-all duration-300 ${
              compact ? "px-2.5 py-1 text-[10px]" : "px-4 py-2 text-xs sm:text-sm"
            } ${
              step.unlocked
                ? "font-semibold"
                : step.isNext
                ? "font-semibold animate-pulse"
                : "opacity-50"
            }`}
            style={{
              borderColor: step.unlocked || step.isNext ? step.color : "rgba(255,255,255,0.15)",
              backgroundColor: step.unlocked
                ? `${step.color}26`
                : step.isNext
                ? `${step.color}14`
                : "rgba(255,255,255,0.04)",
              color: step.unlocked || step.isNext ? step.color : "#9ca3af",
            }}
          >

            <span>{step.unlocked ? "✓" : "₹" + step.minAmount}</span>

            <span>{describeTierReward(step)}</span>

          </div>

        ))}

      </div>

    </div>

  );

}
