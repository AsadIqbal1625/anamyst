import Link from "next/link";

export default function OrderSuccessPage() {

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-4">

      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-xl text-center">

        <h1 className="text-5xl mb-5">

          🎉

        </h1>

        <h2 className="text-4xl font-bold text-black mb-4">

          Order Placed Successfully

        </h2>

        <p className="text-gray-600 text-lg mb-8">

          Thank you for shopping with ANAMYST.

        </p>

        <Link href="/shop">

          <button className="bg-black text-white px-8 py-4 rounded-2xl hover:bg-[#D4AF37] hover:text-black transition duration-300 text-lg font-semibold">

            Continue Shopping

          </button>

        </Link>

      </div>

    </div>

  );

}