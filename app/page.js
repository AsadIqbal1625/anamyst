import Link from "next/link";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/perfume.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center items-center h-full text-center text-white px-6">

        <h1 className="text-5xl sm:text-7xl font-bold mb-4 tracking-wide">
          ANAMYST
        </h1>

        <p className="text-lg sm:text-2xl mb-8 max-w-2xl leading-relaxed">
          Discover fragrances that define your presence
        </p>

        <Link href="/shop">
          <button className="bg-[#D4AF37] text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-[#b8962e] transition duration-300 shadow-xl">
            Explore Collection
          </button>
        </Link>

      </div>
    </div>
  );
}