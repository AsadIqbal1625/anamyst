import Link from "next/link";

export default function Home() {

  return (

    <main className="w-full overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative w-full h-[100vh] overflow-hidden">

        {/* VIDEO */}
        <video
          autoPlay
          muted
          loop
          playsInline
           className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/perfume.mp4" type="video/mp4" />
        </video>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/50" />

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">

          {/* TITLE */}
          <h1 className="text-white text-5xl sm:text-7xl font-bold tracking-[0.15em]">

            ANAMYST

          </h1>

          {/* SUBTITLE */}
          <p className="text-white/90 text-lg sm:text-2xl mt-5 max-w-2xl leading-8">

            Discover fragrances that define your presence

          </p>

          {/* BUTTON */}
          <Link href="/shop">

            <button className="mt-10 bg-[#D4AF37] hover:bg-[#c19b2e] text-white text-xl px-10 py-5 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105">

              Explore Collection

            </button>

          </Link>

        </div>

      </section>

      

    </main>

  );
}