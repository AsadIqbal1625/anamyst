"use client";

import { useEffect, useState } from "react";
import { getCart } from "../../lib/cart";
import Image from "next/image";

export default function CheckoutPage() {

  const [cart, setCart] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {

    setCart(getCart());

  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const placeOrder = () => {

    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {

      alert("Please fill all required fields");

      return;

    }

    alert("Order Placed Successfully ✅");

    console.log({
      customer: form,
      items: cart,
      total,
    });

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-[#faf7f2] to-[#f3f3f3] px-4 py-10">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6 md:p-8">

          <h1 className="text-4xl font-bold text-black mb-10">
            Checkout
          </h1>

          {/* FORM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black text-black"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black text-black"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black text-black"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black text-black"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black text-black"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black text-black"
            />

          </div>

          {/* ADDRESS */}
          <textarea
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black text-black mt-6"
          />

          {/* PAYMENT */}
          <div className="mt-10">

            <h2 className="text-2xl font-bold text-black mb-5">
              Payment Method
            </h2>

            <div className="space-y-4">

              <label className="flex items-center gap-3 border border-gray-300 rounded-2xl p-4 cursor-pointer">

                <input
                  type="radio"
                  checked
                  readOnly
                />

                <span className="text-black font-medium">
                  Cash on Delivery
                </span>

              </label>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div>

          <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-24">

            <h2 className="text-3xl font-bold text-black mb-8">
              Order Summary
            </h2>

            {/* ITEMS */}
            <div className="space-y-5">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="flex gap-4 border-b pb-5"
                >

                  <div className="bg-[#f8f8f8] rounded-2xl overflow-hidden">

                    <Image
                      src={item.image}
                      alt={item.name}
                      width={90}
                      height={90}
                      className="object-contain"
                    />

                  </div>

                  <div className="flex-1">

                    <h3 className="text-black font-semibold text-lg">
                      {item.name}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      Qty: {item.qty}
                    </p>

                    <p className="text-black font-bold mt-2">
                      ₹{item.price * item.qty}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* TOTAL */}
            <div className="flex items-center justify-between mt-8">

              <span className="text-2xl font-bold text-black">
                Total
              </span>

              <span className="text-3xl font-bold text-black">
                ₹{total}
              </span>

            </div>

            {/* BUTTON */}
            <button
              onClick={placeOrder}
              className="w-full mt-8 bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:bg-[#D4AF37] hover:text-black transition duration-300"
            >

              Place Order

            </button>

            {/* TRUST */}
            <div className="mt-8 space-y-3 text-gray-600">

              <p>🚚 Shipping Across India</p>

              <p>🔒 Secure Checkout</p>

              <p>💯 Authentic Luxury Fragrance</p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}