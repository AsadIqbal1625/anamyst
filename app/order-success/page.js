"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();

  const orderId =
    searchParams.get("orderId") || "ANM-XXXXXX";

  return (
    <div className="min-h-screen bg-black text-white">

      {/* SUCCESS CARD */}

      <div className="flex items-center justify-center px-6 py-24">

        <div className="bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-3xl p-12 max-w-lg w-full text-center shadow-2xl">

          {/* ICON */}

          <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-8 text-5xl">

            ✓

          </div>

          {/* TITLE */}

          <h1 className="text-5xl font-bold mb-4 leading-tight">

            Order Placed Successfully

          </h1>

          {/* SUBTITLE */}

          <p className="text-gray-400 mb-10">

            Thank you for shopping with ANAMYST.

          </p>

          {/* ORDER ID */}

          <div className="bg-black border border-[#D4AF37]/20 rounded-2xl p-6 mb-10">

            <p className="text-[#D4AF37] text-lg mb-2">

              Order ID

            </p>

            <p className="text-3xl font-bold">

              {orderId}

            </p>

          </div>

          {/* INFO */}

          <p className="text-sm text-gray-500 mb-8">

            Save this Order ID for tracking your order.

          </p>

          {/* BUTTONS */}

          <div className="flex flex-col gap-4">

            <Link
              href="/track-order"
              className="bg-[#D4AF37] text-black py-4 rounded-2xl font-bold hover:opacity-90 transition"
            >
              Track Order
            </Link>

            <Link
              href="/collections"
              className="border border-[#D4AF37]/30 py-4 rounded-2xl font-bold hover:bg-[#D4AF37]/10 transition"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}