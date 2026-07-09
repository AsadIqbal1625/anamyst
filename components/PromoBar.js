"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PromoBar({ initialCoupon = null }) {

  const [coupon, setCoupon] = useState(initialCoupon);
  const [timeLeft, setTimeLeft] = useState(null);

  /* LIVE COUNTDOWN */

  useEffect(() => {

    if (!coupon?.expiresAt) {
      setTimeLeft(null);
      return;
    }

    const tick = () => {

      const diff =
        new Date(coupon.expiresAt).getTime() - Date.now();

      if (diff <= 0) {
        /* expired → hide the bar */
        setCoupon(null);
        return;
      }

      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });

    };

    tick();

    const id = setInterval(tick, 1000);

    return () => clearInterval(id);

  }, [coupon]);

  useEffect(() => {

    fetch("/api/coupons/active")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.coupon) setCoupon(data.coupon);
      })
      .catch(() => {});

  }, []);

  if (!coupon) return null;

  const offer =
    coupon.discountType === "percent"
      ? `${coupon.value}% OFF`
      : `₹${coupon.value} OFF`;

  const minText = coupon.minOrder
    ? ` on orders above ₹${coupon.minOrder}`
    : "";

  const copyCode = () => {
    try {
      navigator.clipboard.writeText(coupon.code);
      toast.success(`Code ${coupon.code} copied — use it at checkout`);
    } catch {
      toast(coupon.code);
    }
  };

  return (

    <div className="relative z-40 bg-gradient-to-r from-[#8a6d1f] via-[#D4AF37] to-[#8a6d1f] text-black">

      <button
        onClick={copyCode}
        className="w-full flex items-center justify-center gap-2 px-10 py-2.5 text-center"
      >

        <span className="text-[11px] sm:text-xs font-semibold tracking-[2px] uppercase">

          ✦ {offer}{minText} — Use code

        </span>

        <span className="bg-black text-[#D4AF37] text-[11px] sm:text-xs font-bold tracking-[2px] px-3 py-1 rounded-full">

          {coupon.code}

        </span>

        {timeLeft && (

          <span className="text-[11px] sm:text-xs font-bold tracking-[1px] tabular-nums">

            ⏳ Ends in{" "}
            {timeLeft.d > 0 && `${timeLeft.d}d `}
            {String(timeLeft.h).padStart(2, "0")}h{" "}
            {String(timeLeft.m).padStart(2, "0")}m{" "}
            {String(timeLeft.s).padStart(2, "0")}s

          </span>

        )}

        <span className="hidden sm:inline text-[10px] uppercase tracking-[2px] opacity-70">

          Tap to copy

        </span>

      </button>

    </div>

  );

}
