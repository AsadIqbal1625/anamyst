"use client";

import { useRef, useState } from "react";

/* Sideways product row. Phones swipe it; the arrows let mouse and
   trackpad users move it too, and the gold line shows how far along
   you are. Desktop (lg and up) shows a grid instead, so the controls
   are hidden there. */

export default function ScentRail({ className = "", children }) {

  const rail = useRef(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function onScroll() {

    const el = rail.current;
    const max = el.scrollWidth - el.clientWidth;

    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setAtStart(el.scrollLeft < 4);
    setAtEnd(el.scrollLeft > max - 4);

  }

  /* one card at a time */
  function move(direction) {

    const el = rail.current;
    const card = el.firstElementChild;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 12;
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8;

    el.scrollBy({ left: direction * step, behavior: "smooth" });

  }

  const arrowClass =
    "w-10 h-10 shrink-0 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:border-gold hover:text-gold disabled:opacity-30 disabled:pointer-events-none transition-colors";

  return (

    <>

      <div ref={rail} onScroll={onScroll} className={className}>
        {children}
      </div>

      <div className="lg:hidden max-w-7xl mx-auto px-6 mt-6 flex items-center gap-4">

        {/* progress line */}
        <div className="relative flex-1 h-px bg-white/15 overflow-hidden" aria-hidden="true">
          <span
            className="absolute inset-y-0 w-1/3 bg-gold transition-[left] duration-150"
            style={{ left: `${progress * (100 - 100 / 3)}%` }}
          />
        </div>

        <button
          type="button"
          onClick={() => move(-1)}
          disabled={atStart}
          aria-label="Previous scents"
          className={arrowClass}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => move(1)}
          disabled={atEnd}
          aria-label="Next scents"
          className={arrowClass}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </div>

    </>

  );

}
