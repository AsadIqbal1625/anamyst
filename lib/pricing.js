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

/* FULL ORDER BREAKDOWN — the single source of truth for what a cart
   costs. Cart, checkout and the order API all call this so the price
   shown can never drift from the price charged.

   A coupon and the occasion tiers are mutually exclusive: applying a
   coupon replaces the tier offer completely, including the free
   shipping it would have unlocked. */

export function getOrderTotals({
  subtotal,
  tiers,
  shippingFee = 0,
  codFee = 0,
  paymentMethod = "RAZORPAY",
  couponCode = "",
  couponDiscount = 0,
}) {

  const amount = Number(subtotal) || 0;

  const hasCoupon = Boolean(couponCode);

  const benefits = getPricingBenefits(amount, tiers);

  const discount = hasCoupon
    ? Math.min(Number(couponDiscount) || 0, amount)
    : Math.round((amount * benefits.discountPercent) / 100);

  const discountLabel = hasCoupon
    ? couponCode
    : benefits.discountPercent > 0
    ? `${benefits.discountPercent}% OFF`
    : "";

  /* tier free shipping is part of the tier offer, so a coupon
     forfeits it too — otherwise the two would stack */
  const freeShipping = !hasCoupon && benefits.freeShipping;

  const shippingCost = freeShipping ? 0 : Number(shippingFee) || 0;

  const codCharge =
    paymentMethod === "COD" ? Number(codFee) || 0 : 0;

  const total =
    Math.max(amount - discount, 0) + shippingCost + codCharge;

  return {
    subtotal: amount,
    discount,
    discountLabel,
    freeShipping,
    shippingCost,
    codCharge,
    total,
    benefits,
    /* false while a coupon is overriding the occasion offer */
    tiersApply: !hasCoupon,
  };

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
