"use client";

/* Switches the whole storefront between dark gold (default) and light
   ivory. The choice is remembered in this browser; a small script in
   app/layout.js applies it before the page paints, so there's no flash.

   Both icons are always rendered and CSS shows the right one, so the
   button looks correct from the first paint without waiting for React. */

function applyTheme(next) {

  const root = document.documentElement;

  if (next === "light") root.dataset.theme = "light";
  else delete root.dataset.theme;

  try {
    localStorage.setItem("theme", next);
  } catch {
    /* private browsing: the switch still works for this visit */
  }

}

export default function ThemeToggle({ className = "" }) {

  function toggle() {

    const next =
      document.documentElement.dataset.theme === "light" ? "dark" : "light";

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* soft cross-fade between the two looks where the browser supports it */
    if (document.startViewTransition && !reduceMotion) {
      document.startViewTransition(() => applyTheme(next));
    } else {
      applyTheme(next);
    }

  }

  return (

    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between dark and light mode"
      title="Dark / light mode"
      className={`theme-toggle w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-gold/40 text-gold hover:border-gold transition-colors ${className}`}
    >

      {/* sun: shown in dark mode, switches to light */}
      <svg
        className="icon-sun w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
      </svg>

      {/* moon: shown in light mode, switches back to dark */}
      <svg
        className="icon-moon w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
      </svg>

    </button>

  );

}
