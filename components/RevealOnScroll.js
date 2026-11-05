"use client";

import { useEffect } from "react";

/* Fades elements marked className="reveal" in as they scroll into view.

   Content is only hidden once this has run (html.reveal-ready), so if
   JavaScript is off or fails, everything simply stays visible. Skipped
   entirely for people who ask their device for reduced motion. */

export default function RevealOnScroll() {

  useEffect(() => {

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const root = document.documentElement;

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }

        });

      },
      { rootMargin: "0px 0px -8% 0px" }
    );

    document
      .querySelectorAll(".reveal")
      .forEach((el) => observer.observe(el));

    root.classList.add("reveal-ready");

    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };

  }, []);

  return null;

}
