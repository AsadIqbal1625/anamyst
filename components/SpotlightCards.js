"use client";

import { useEffect } from "react";

/* Moves a soft gold light under the mouse on any element with
   className="spotlight". One shared listener covers every card, including
   ones that load later. Skipped on touch screens, which have no pointer
   to follow. */

export default function SpotlightCards() {

  useEffect(() => {

    if (!window.matchMedia("(hover: hover)").matches) return;

    const onMove = (e) => {

      const card = e.target.closest?.(".spotlight");

      if (!card) return;

      const box = card.getBoundingClientRect();

      card.style.setProperty("--mx", `${e.clientX - box.left}px`);
      card.style.setProperty("--my", `${e.clientY - box.top}px`);

    };

    document.addEventListener("pointermove", onMove, { passive: true });

    return () =>
      document.removeEventListener("pointermove", onMove);

  }, []);

  return null;

}
