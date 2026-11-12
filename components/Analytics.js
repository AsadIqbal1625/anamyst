"use client";

import { useEffect } from "react";

/* GOOGLE ANALYTICS, loaded late on purpose.
   The tag (about 180 KB) is fetched only after the visitor first
   interacts, or 4 seconds after the page loads, whichever comes first,
   so it never competes with the page itself. Events sent before then
   are queued and delivered once it loads. */

export default function Analytics({ id }) {

  useEffect(() => {

    if (!id || window.__anamystGa) return;

    window.__anamystGa = true;

    /* queue: works immediately, sends once the tag arrives */
    window.dataLayer = window.dataLayer || [];

    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", id);

    const events = ["pointerdown", "keydown", "scroll", "touchstart"];

    let timer = null;

    const load = () => {

      events.forEach((e) => window.removeEventListener(e, load));
      clearTimeout(timer);

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      document.head.appendChild(script);

    };

    events.forEach((e) =>
      window.addEventListener(e, load, { once: true, passive: true })
    );

    timer = setTimeout(load, 4000);

  }, [id]);

  return null;

}
