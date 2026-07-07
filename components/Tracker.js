"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/track";

export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (pathname.startsWith("/product/")) {
      trackEvent("product_view", {
        productId: pathname.split("/")[2],
      });
    } else if (pathname === "/checkout") {
      trackEvent("checkout_started");
    } else if (pathname === "/order-success") {
      trackEvent("purchase");
    } else {
      trackEvent("page_view");
    }

    // Google Analytics page view (if GA is configured)
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}
