import Link from "next/link";

export default function Home() {

  return (

    <main className="w-full bg-black overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative w-full min-h-[100dvh] overflow-hidden">

        {/* VIDEO */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/perfume.mp4" type="video/mp4" />
        </video>

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center">

          {/* TITLE */}
          <h1 className="text-white text-5xl sm:text-7xl md:text-8xl font-bold tracking-[0.15em] leading-tight">

            ANAMYST

          </h1>

          {/* SUBTITLE */}
          <p className="text-white/90 text-lg sm:text-2xl mt-6 max-w-2xl leading-relaxed">

            Discover fragrances that define your presence

          </p>

          {/* BUTTON */}
          <Link href="/shop">

            <button className="mt-10 bg-[#D4AF37] hover:bg-[#c19b2e] text-white text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105">

              Explore Collection

            </button>

          </Link>

        </div>

      </section>

    </main>

  );
}