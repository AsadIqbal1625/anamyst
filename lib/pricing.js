/* TIER BENEFITS FOR A GIVEN CART TOTAL
   Tiers unlock cumulatively — reaching a higher tier keeps the
   free shipping and takes the best (highest) discount percent
   from every tier the total has crossed. */

export function getPricingBenefits(total, tiers) {

  const amount = Number(total) || 0;

  const activeTiers = Array.isArray(tiers)
    ? tiers.filter((t) => t && t.active !== false)
    : [];

  const unlocked = activeTiers.filter(
    (t) => amount >= Number(t.minAmount || 0)
  );

  const freeShipping = unlocked.some((t) => t.freeShipping);

  const bestTier = unlocked.reduce((best, t) => {
    const pct = Number(t.discountPercent) || 0;
    if (!best || pct > best.discountPercent) {
      return { label: t.label, discountPercent: pct };
    }
    return best;
  }, null);

  const nextTier = activeTiers
    .filter((t) => amount < Number(t.minAmount || 0))
    .sort((a, b) => a.minAmount - b.minAmount)[0] || null;

  return {
    freeShipping,
    discountPercent: bestTier?.discountPercent || 0,
    discountLabel: bestTier?.label || "",
    nextTier,
  };

}

/* CUSTOMER-FACING REWARD TEXT — always states the actual benefit
   ("Free Shipping" / "10% OFF"), never the internal occasion label,
   so it makes sense with no other context. */

export function describeTierReward(tier) {

  if (!tier) return "";

  const parts = [];

  if (tier.freeShipping) parts.push("Free Shipping");

  if (Number(tier.discountPercent) > 0) {
    parts.push(`${tier.discountPercent}% OFF`);
  }

  return parts.join(" + ") || "a reward";

}

/* A distinct color per unlock stage — used to give each tier its own
   identity as it lights up (gold → orange → pink → green). */

export const TIER_STEP_COLORS = [
  "#D4AF37",
  "#FF9635",
  "#FF5C7A",
  "#22C55E",
];

/* ORDERED TIER CHECKPOINTS for a progress track — each tier annotated
   with whether it's unlocked yet, whether it's the very next target
   (so the UI can pulse/highlight it), and its step color. */

export function getTierSteps(total, tiers) {

  const amount = Number(total) || 0;

  const steps = (Array.isArray(tiers) ? tiers : [])
    .filter((t) => t && t.active !== false)
    .slice()
    .sort((a, b) => Number(a.minAmount) - Number(b.minAmount));

  let nextAssigned = false;

  return steps.map((t, i) => {

    const unlocked = amount >= Number(t.minAmount || 0);

    const isNext = !unlocked && !nextAssigned
      ? ((nextAssigned = true), true)
      : false;

    return {
      ...t,
      unlocked,
      isNext,
      color: TIER_STEP_COLORS[i % TIER_STEP_COLORS.length],
    };

  });

}
