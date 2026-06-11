import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-6xl font-bold text-[#D4AF37] mb-6">
        404
      </h1>

      <h2 className="text-3xl font-semibold mb-4">
        Page Not Found
      </h2>

      <p className="text-gray-400 text-center max-w-lg mb-8">
        The page you are looking for does not exist or may have been moved.
      </p>

      <Link
        href="/"
        className="bg-[#D4AF37] text-black px-8 py-4 rounded-2xl font-semibold hover:opacity-90 transition"
      >
        Return to Home
      </Link>
    </div>
  );
}