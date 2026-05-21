export default async function OrderSuccessPage({

  searchParams,

}) {

  const orderId =
    searchParams.orderId;

  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="max-w-2xl w-full bg-white/5 border border-white/10 rounded-[40px] p-10 text-center">

        <div className="text-7xl mb-6">

          ✅

        </div>

        <h1 className="text-5xl font-bold mb-6">

          Order Placed Successfully

        </h1>

        <p className="text-gray-300 text-lg leading-8">

          Thank you for shopping with
          ANAMYST.

        </p>

        <p className="text-[#D4AF37] text-2xl font-bold mt-8">

          Order ID:
          {" "}
          {orderId}

        </p>

        <p className="text-gray-400 mt-4">

          Save this Order ID for tracking your order.

        </p>

        <a
          href="/track-order"
          className="inline-block mt-10 bg-[#D4AF37] hover:opacity-90 text-black font-semibold px-8 py-4 rounded-2xl transition"
        >

          Track Order

        </a>

      </div>

    </div>

  );

}