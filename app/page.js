import Link from "next/link";

export default function Home() {
  return (
    <div className="relative h-screen w-full">

      {/* Background video */}
      <video autoPlay loop muted className="absolute w-full h-full object-cover">
     <source src="/perfume.mp4" type="video/mp4" />
     </video>

      {/* Dark Overlay */}
      <div className="absolute w-full h-full bg-black/50 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-6">

        <h1 className="text-4xl sm:text-6xl font-bold mb-4">
          ANAMYST
        </h1>

        <p className="text-lg sm:text-xl mb-6 max-w-xl">
          Discover fragrances that define your presence
        </p>

        <Link href="/shop">
        <button className="bg-[#D4AF37] px-6 py-3 rounded-lg hover:bg-[#b8962e] transition">
         Explore Collection
         </button>
        </Link>

      </div>
    </div>
  );
}