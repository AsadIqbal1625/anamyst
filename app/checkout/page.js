"use client";

import { useEffect, useState } from "react";
import { getCart } from "../../lib/cart";

export default function CheckoutPage() {

  const [cart, setCart] = useState([]);

  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    setCart(getCart());
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleWhatsAppOrder = () => {

    if (!name || !phone || !address) {
      alert("Please fill all details ❌");
      return;
    }

    const items = cart
      .map(
        (item) =>
          `• ${item.name} x${item.qty} - ₹${item.price * item.qty}`
      )
      .join("\n");

    const message = `🛍️ *New Order - ANAMYST*

👤 Name: ${name}

📞 Phone: ${phone}

📍 Address: ${address}

━━━━━━━━━━━━━━

🛒 ORDER DETAILS

${items}

━━━━━━━━━━━━━━

💰 Total: ₹${total}

💳 Payment Method: WhatsApp Confirmation`;

    window.open(
      `https://wa.me/918303078373?text=${encodeURIComponent(message)}`
    );
  };

  const handleCOD = () => {

    if (!name || !phone || !address) {
      alert("Please fill all details ❌");
      return;
    }

    alert("Order placed successfully ✅");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-[#faf7f2] to-[#f3f3f3] p-6 md:p-10">

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

          <h1 className="text-4xl font-bold mb-8">
            Checkout
          </h1>

          {/* Inputs */}
          <div className="space-y-5">

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:border-black transition"
            />

            <input
              type="number"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.slice(0, 10))
              }
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:border-black transition"
            />

            <textarea
              placeholder="Delivery Address"
              rows="5"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:border-black transition"
            />

          </div>

          {/* Buttons */}
          <div className="grid sm:grid-cols-2 gap-5 mt-8">

            {/* COD */}
            <button
              onClick={handleCOD}
              className="bg-black text-white py-4 rounded-2xl font-semibold hover:bg-[#D4AF37] hover:text-black transition duration-300 shadow-lg"
            >
              Cash on Delivery
            </button>

            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppOrder}
              className="bg-green-600 text-white py-4 rounded-2xl font-semibold hover:bg-green-700 transition duration-300 shadow-lg"
            >
              Order via WhatsApp
            </button>

          </div>

          {/* Trust */}
          <div className="mt-8 space-y-3 text-sm text-gray-500">

            <p>🚚 Shipping Across India • T&C Apply</p>

            <p>🔒 Secure Checkout</p>

            <p>💯 Authentic Luxury Fragrance</p>

            <p>📦 Easy WhatsApp Support</p>

          </div>

        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-3xl shadow-xl p-8 h-fit border border-gray-100 sticky top-24">

          <h2 className="text-3xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="space-y-5">

            {cart.map((item) => (

              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-4"
              >

                <div>

                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Qty: {item.qty}
                  </p>

                </div>

                <p className="font-semibold">
                  ₹{item.price * item.qty}
                </p>

              </div>

            ))}

          </div>

          {/* Total */}
          <div className="flex justify-between items-center mt-8 pt-5 border-t">

            <span className="text-2xl font-bold">
              Total
            </span>

            <span className="text-2xl font-bold">
              ₹{total}
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}