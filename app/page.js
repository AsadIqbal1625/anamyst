/* The campaign is read from the DB below. Without this the homepage
   would be prerendered once at build time and the banner would stay
   frozen until the next deploy — this re-generates it at most once a
   minute, so toggling the campaign in admin goes live on its own. */
export const revalidate = 60;

export const metadata = {
  title: "Anamyst | Luxury Perfumes & Attars from India",
  description:
    "Anamyst is an Indian luxury fragrance brand from Lucknow. Shop long-lasting Anamyst perfumes, attars, fresheners and gift sets online.",
  alternates: {
    canonical: "https://www.anamyst.com/",
  },
  keywords: [
    "luxury perfume",
    "premium fragrance",
    "oud perfume",
    "luxury fragrance india",
    "ANAMYST perfumes",
    "designer perfume",
    "niche fragrance",
  ],
};

import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Jost } from "next/font/google";
import BrandWordmark from "../components/BrandWordmark";
import RevealOnScroll from "../components/RevealOnScroll";
import SpotlightCards from "../components/SpotlightCards";
import Testimonials from "../components/Testimonials";
import LatestNotices from "../components/LatestNotices";
import OccasionBanner from "../components/OccasionBanner";
import { connectDB } from "../lib/mongodb";
import Setting from "../models/Setting";
import Product from "../models/Product";

/* Geometric, like the wordmark. "optional" never swaps the font in late,
   which keeps the layout-shift score at 0 on slow connections. */
const displayFont = Jost({
  subsets: ["latin"],
  display: "optional",
});

/* Italic serif for the one highlighted word in each headline */
const accentFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "500",
  style: "italic",
  display: "optional",
  variable: "--font-accent",
});

/* Read the campaign server-side (same approach as the promo coupon in
   layout.js) so the page knows on first paint whether the banner is
   running — the hero is sized to share the screen with it instead of
   both claiming a full viewport, and there's no pop-in/layout shift. */

async function getCampaignData() {

  try {

    await connectDB();

    const settings = await Setting.findOne({ key: "store" }).lean();

    if (!settings?.campaign?.enabled) return null;

    const tiers = (settings.discountTiers || [])
      .filter((t) => t && t.active !== false)
      .map((t) => ({
        label: t.label || "",
        minAmount: Number(t.minAmount) || 0,
        discountPercent: Number(t.discountPercent) || 0,
        freeShipping: Boolean(t.freeShipping),
        active: true,
      }));

    if (tiers.length === 0) return null;

    return {
      campaign: {
        enabled: true,
        title: settings.campaign.title || "",
        tagline: settings.campaign.tagline || "",
        emoji: settings.campaign.emoji || "",
        image: settings.campaign.image || "",
      },
      discountTiers: tiers,
    };

  } catch {

    return null;

  }

}

const COLLECTIONS = [
  {
    title: "Perfumes",
    category: "perfumes",
    href: "/shop/perfumes",
    desc: "Signature scents crafted for timeless elegance and modern luxury.",
  },
  {
    title: "Attars",
    category: "attars",
    href: "/shop/attars",
    desc: "Rich alcohol-free attars inspired by heritage and sophistication.",
  },
  {
    title: "Fresheners",
    category: "fresheners",
    href: "/shop/fresheners",
    desc: "Elevate your surroundings with refreshing premium aromas.",
  },
  {
    title: "Premium Gifts",
    category: "premium gifts",
    href: "/shop/premium-gifts",
    desc: "Luxurious gifting collections for unforgettable impressions.",
  },
  {
    title: "Combos",
    category: "combos",
    href: "/shop/combos",
    desc: "Carefully paired fragrance collections for premium experiences.",
  },
];

/* A tile only appears once its collection has something to sell, so
   adding the first attar makes that tile show up on its own. Featured
   scents lead with best sellers and show each fragrance once, not its
   20ml and 50ml sizes side by side. */

async function getShowcase() {

  try {

    await connectDB();

    const products = await Product.find(
      {},
      "name category price oldPrice image tag stock"
    ).lean();

    const collections = COLLECTIONS.map((c) => ({
      ...c,
      image: products.find(
        (p) => (p.category || "").toLowerCase() === c.category
      )?.image,
    })).filter((c) => c.image);

    const seen = new Set();

    const featured = products
      .filter((p) => p.stock > 0 && p.image)
      .sort(
        (a, b) =>
          Number(b.tag === "Best Seller") -
          Number(a.tag === "Best Seller")
      )
      .filter((p) => {
        const base = p.name.split("-")[0].trim().toLowerCase();
        if (seen.has(base)) return false;
        seen.add(base);
        return true;
      })
      .slice(0, 8);

    return { collections, featured };

  } catch {

    return { collections: [], featured: [] };

  }

}

const RIBBON = [
  "Long Lasting",
  "Premium Fragrance Oils",
  "Luxury Packaging",
  "Secure Checkout",
  "Delivered Across India",
];

const SCENT_LAYERS = [
  {
    name: "Top Notes",
    title: "The first impression",
    desc: "Bright and immediate. What the world meets first.",
  },
  {
    name: "Heart Notes",
    title: "The character",
    desc: "As the opening settles, the fragrance reveals who it is.",
  },
  {
    name: "Base Notes",
    title: "The presence",
    desc: "Deep and slow. What stays with you, and stays with them.",
  },
];

const EXPERIENCE = [
  {
    title: "Authentic Luxury",
    desc: "Premium perfumes and attars crafted with high-quality fragrance oils.",
  },
  {
    title: "Long Lasting",
    desc: "Designed for lasting presence throughout your day and evenings.",
  },
  {
    title: "Luxury Packaging",
    desc: "Elegant packaging created for premium gifting experiences.",
  },
  {
    title: "Secure Checkout",
    desc: "Fast, secure payments and reliable nationwide delivery.",
  },
];

function SectionLabel({ children }) {

  return (

    <p className="flex items-center gap-4 uppercase tracking-[0.35em] text-[#D4AF37] text-[11px] mb-6">

      <span className="w-8 h-px bg-[#D4AF37]" />

      {children}

    </p>

  );

}

const COLLECTION_SPANS = [
  "md:col-span-7",
  "md:col-span-5",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
];

export default async function Home() {

  const [campaignData, { collections, featured }] = await Promise.all([
    getCampaignData(),
    getShowcase(),
  ]);

  const hasCampaign = Boolean(campaignData);

  return (

    <main
      className={`${displayFont.className} ${accentFont.variable} w-full bg-black overflow-hidden text-white`}
    >

      <RevealOnScroll />

      <SpotlightCards />

      {/* OCCASION CAMPAIGN BANNER (spend more, save more) —
          above the hero so it's visible without scrolling */}
      <OccasionBanner initialSettings={campaignData} />

      {/* ================= HERO =================
          One video element for every screen size: full-bleed behind the
          text on phones, a framed panel on desktop. */}
      <section
        className={`relative isolate flex overflow-hidden ${
          hasCampaign
            ? "min-h-[62vh] lg:min-h-[74vh]"
            : "min-h-[100dvh] lg:min-h-[92vh]"
        }`}
      >

        <div className="hero-glow glow-breathe absolute inset-0 -z-20 hidden lg:block" />

        <div className="hero-grid absolute inset-0 -z-20 hidden lg:block" />

        <div className="flex flex-col justify-end lg:justify-center w-full max-w-7xl mx-auto px-6 lg:px-10 pb-14 pt-16 lg:py-16 lg:relative">

          {/* VIDEO */}
          <div className="hero-video absolute inset-0 -z-10 overflow-hidden lg:inset-y-10 lg:left-auto lg:right-10 lg:aspect-[4/5]">

            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/perfume-poster.jpg"
              className="w-full h-full object-cover"
            >
              <source
                src="/perfume.mp4"
                type="video/mp4"
              />
            </video>

            {/* PHONE: keeps the text readable over the video */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black lg:hidden" />

            {/* DESKTOP: viewfinder corners and a hairline frame */}
            <div className="absolute inset-0 border border-[#D4AF37]/20 hidden lg:block" />

            {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map(
              (corner) => (
                <span
                  key={corner}
                  className={`absolute w-6 h-6 border-[#D4AF37] hidden lg:block ${corner}`}
                />
              )
            )}

          </div>

          {/* BRAND */}
          <div className="lg:max-w-[50%]">

            <p className="hero-rise uppercase tracking-[0.35em] text-[#D4AF37] text-[11px] lg:text-xs mb-6 lg:mb-8">

              Luxury Fragrance House

            </p>

            <h1 className="text-white">

              <BrandWordmark draw className="w-full max-w-[560px] h-auto" />

            </h1>

            <p
              className="hero-rise text-white/80 text-xl lg:text-2xl font-light mt-6 lg:mt-8 max-w-md leading-relaxed"
              style={{ "--d": "250ms" }}
            >

              Discover fragrances that define your{" "}
              <span className="accent">presence</span>

            </p>

            <div
              className="hero-rise flex flex-wrap gap-3 mt-8 lg:mt-10"
              style={{ "--d": "400ms" }}
            >

              <Link
                href="/shop"
                className="btn-gold bg-[#D4AF37] hover:bg-[#e6c34a] text-black px-8 py-4 text-sm uppercase tracking-[0.2em] font-medium transition-colors duration-300"
              >
                Explore Collection
              </Link>

              {featured.length > 0 && (

                <Link
                  href="#signature"
                  className="border border-white/30 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white px-8 py-4 text-sm uppercase tracking-[0.2em] transition-colors duration-300"
                >
                  Signature Scents
                </Link>

              )}

            </div>

          </div>

        </div>

      </section>

      {/* RIBBON — doubled so the scroll loops without a visible jump */}
      <div className="border-y border-white/10 py-4 overflow-hidden">

        <div className="ribbon flex w-max">

          {[0, 1].map((copy) => (

            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0"
            >

              {[...RIBBON, ...RIBBON].map((item, i) => (

                <span
                  key={i}
                  className="flex items-center gap-10 pr-10 uppercase tracking-[0.3em] text-[11px] text-white/50 whitespace-nowrap"
                >

                  {item}

                  <span className="w-1 h-1 rotate-45 bg-[#D4AF37]" />

                </span>

              ))}

            </div>

          ))}

        </div>

      </div>

      {/* COLLECTIONS */}
      {collections.length > 0 && (

        <section className="px-6 lg:px-10 py-24 lg:py-32">

          <div className="max-w-7xl mx-auto">

            <div className="reveal mb-14">

              <SectionLabel>The Collections</SectionLabel>

              <h2 className="text-4xl md:text-6xl font-light tracking-tight">

                Shop By <span className="accent">Collection</span>

              </h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

              {collections.map((c, i) => (

                <Link
                  key={c.href}
                  href={c.href}
                  className={`reveal spotlight group relative block overflow-hidden h-[420px] lg:h-[520px] border border-white/10 hover:border-[#D4AF37]/50 transition-colors duration-500 ${COLLECTION_SPANS[i]}`}
                  style={{ "--d": `${(i % 3) * 110}ms` }}
                >

                  <Image
                    src={c.image}
                    alt={`Anamyst ${c.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-7 lg:p-9">

                    <p className="text-[#D4AF37] text-[11px] tracking-[0.3em] mb-3">

                      0{i + 1}

                    </p>

                    <h3 className="text-3xl lg:text-4xl font-light mb-3">

                      {c.title}

                    </h3>

                    <p className="text-white/70 font-light leading-relaxed max-w-sm mb-5">

                      {c.desc}

                    </p>

                    <span className="uppercase tracking-[0.25em] text-[11px] text-[#D4AF37]">

                      Explore →

                    </span>

                  </div>

                </Link>

              ))}

            </div>

          </div>

        </section>

      )}

      {/* SIGNATURE SCENTS — swipeable rail */}
      {featured.length > 0 && (

        <section
          id="signature"
          className="py-24 lg:py-32 border-t border-white/10 scroll-mt-28"
        >

          <div className="reveal max-w-7xl mx-auto px-6 lg:px-10 mb-12 flex flex-wrap items-end justify-between gap-6">

            <div>

              <SectionLabel>Signature Scents</SectionLabel>

              <h2 className="text-4xl md:text-6xl font-light tracking-tight">

                Wear Your <span className="accent">Presence</span>

              </h2>

            </div>

            <Link
              href="/shop"
              className="uppercase tracking-[0.25em] text-[11px] text-[#D4AF37] hover:text-white transition-colors"
            >
              View All →
            </Link>

          </div>

          <div className="scent-rail flex gap-4 lg:gap-y-10 overflow-x-auto snap-x snap-mandatory px-6 pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible lg:max-w-7xl lg:mx-auto lg:px-10">

            {featured.map((p, i) => (

              <Link
                key={String(p._id)}
                href={`/product/${p._id}`}
                className="reveal group snap-start shrink-0 w-[72vw] sm:w-[320px] lg:w-auto"
                style={{ "--d": `${(i % 4) * 90}ms` }}
              >

                <div className="spotlight relative aspect-[4/5] overflow-hidden border border-white/10 group-hover:border-[#D4AF37]/50 transition-colors duration-500 bg-white/5">

                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 72vw, (max-width: 1024px) 320px, 25vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />

                  {p.tag && (

                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur text-[10px] uppercase tracking-[0.2em] px-3 py-1.5">

                      {p.tag}

                    </span>

                  )}

                </div>

                <h3 className="mt-4 text-lg font-light leading-snug group-hover:text-[#D4AF37] transition-colors">

                  {p.name}

                </h3>

                <p className="mt-1 text-white/70">

                  ₹{p.price}

                  {p.oldPrice > p.price && (

                    <span className="ml-2 text-white/40 line-through text-sm">

                      ₹{p.oldPrice}

                    </span>

                  )}

                </p>

              </Link>

            ))}

          </div>

        </section>

      )}

      {/* ANATOMY OF A SCENT */}
      <section className="px-6 lg:px-10 py-24 lg:py-32 border-t border-white/10">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">

          <div className="reveal relative aspect-[4/5] max-w-md mx-auto w-full border border-[#D4AF37]/20 shadow-[0_0_120px_rgba(212,175,55,0.12)]">

            <span className="absolute -inset-3 border border-[#D4AF37]/10 pointer-events-none" />

            <Image
              src="/perfume-poster.jpg"
              alt="Anamyst attar bottle with gold cap"
              fill
              sizes="(max-width: 1024px) 90vw, 448px"
              className="object-cover"
            />

          </div>

          <div>

            <div className="reveal">

              <SectionLabel>The Craft</SectionLabel>

              <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-12">

                A Scent Unfolds In <span className="accent">Three Acts</span>

              </h2>

            </div>

            <div className="relative border-l border-[#D4AF37]/20">

              {/* gold line that draws itself down the three stages */}
              <span className="reveal act-fill absolute -left-px top-0 w-px h-full bg-[#D4AF37] origin-top" />

              {SCENT_LAYERS.map((layer, i) => (

                <div
                  key={layer.name}
                  className="reveal relative pl-8 pb-10 last:pb-0"
                  style={{ "--d": `${i * 220}ms` }}
                >

                  <span className="absolute -left-[4px] top-2 w-2 h-2 rotate-45 bg-[#D4AF37]" />

                  <p className="uppercase tracking-[0.3em] text-[11px] text-[#D4AF37] mb-2">

                    {layer.name}

                  </p>

                  <h3 className="text-2xl font-light mb-2">

                    {layer.title}

                  </h3>

                  <p className="text-white/60 font-light leading-relaxed">

                    {layer.desc}

                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* THE ANAMYST EXPERIENCE */}
      <section className="px-6 lg:px-10 py-24 lg:py-32 border-t border-white/10">

        <div className="max-w-7xl mx-auto">

          <div className="reveal mb-14">

            <SectionLabel>Why Choose Us</SectionLabel>

            <h2 className="text-4xl md:text-6xl font-light tracking-tight">

              The ANAMYST <span className="accent">Experience</span>

            </h2>

          </div>

          {/* gap-px over a tinted grid draws the hairlines between cells */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-white/10 border border-white/10">

            {EXPERIENCE.map((item, i) => (

              <div
                key={item.title}
                className="reveal spotlight bg-black hover:bg-[#0d0b05] transition-colors duration-500 p-8 lg:p-10"
                style={{ "--d": `${i * 90}ms` }}
              >

                <p className="text-[#D4AF37] text-[11px] tracking-[0.3em] mb-10">

                  0{i + 1}

                </p>

                <h3 className="text-2xl font-light mb-4">

                  {item.title}

                </h3>

                <p className="text-white/60 font-light leading-relaxed">

                  {item.desc}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Tells Google the site's name, including the spellings people use */}
      <script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Anamyst",
            alternateName: ["ANAMYST", "Anamyst Perfumes", "Anamyst Fragrances"],
            url: "https://www.anamyst.com/",
          }),
        }}
      />

      {/* WHAT IS ANAMYST — real text, because the logo is a drawing */}
      <section className="px-6 py-24 border-t border-white/10">

        <div className="reveal max-w-3xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-light mb-6">

            What is Anamyst?

          </h2>

          <p className="text-white/60 text-lg font-light leading-9">

            Anamyst is an Indian luxury fragrance brand based in Lucknow,
            Uttar Pradesh. Anamyst creates long-lasting perfumes, attars,
            fresheners, gift sets and combos, delivered across India.

          </p>

        </div>

      </section>

      <LatestNotices />

      <Testimonials />

      {/* CLOSING */}
      <section className="closing-glow px-6 py-20 lg:py-28 border-t border-white/10 text-center">

        <div className="reveal max-w-3xl mx-auto">

          {/* small gold ornament */}
          <div
            aria-hidden="true"
            className="flex items-center justify-center gap-4 mb-8"
          >

            <span className="w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />

            <span className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />

            <span className="w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />

          </div>

          <h2 className="text-5xl md:text-7xl font-light tracking-tight mb-6">

            Crafted For <span className="accent">Presence</span>

          </h2>

          <p className="text-white/60 text-lg font-light leading-8 mb-10">

            ANAMYST blends sophistication, elegance, and timeless fragrance artistry into every bottle.

          </p>

          <Link
            href="/shop"
            className="btn-gold inline-block bg-[#D4AF37] hover:bg-[#e6c34a] text-black px-10 py-4 text-sm uppercase tracking-[0.2em] font-medium transition-colors duration-300"
          >
            Explore All Collections
          </Link>

        </div>

      </section>

    </main>

  );

}
