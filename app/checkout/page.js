"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { useRouter } from "next/navigation";

import {
  getCart,
  clearCart,
} from "../../lib/cart";

export default function CheckoutPage() {

  const router = useRouter();

  const [cart, setCart] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

  /* LOAD CART */
  useEffect(() => {

    const cartItems =
      getCart();

    if (
      !cartItems ||
      cartItems.length === 0
    ) {

      router.push("/cart");

    }

    setCart(cartItems);

  }, [router]);

  /* HANDLE INPUT */
  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };

  /* TOTAL */
  const total = cart.reduce(

    (sum, item) =>

      sum +
      item.price *
      item.quantity,

    0

  );

  /* PLACE ORDER */
  const placeOrder = async () => {

    if (

      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode

    ) {

      alert(
        "Please fill all required fields"
      );

      return;

    }

    try {

      setLoading(true);

      const orderData = {

        customer: form,

        products: cart,

        totalAmount: total,

        paymentMethod:
          "Cash on Delivery",

        paymentStatus:
          "Pending",

        orderStatus:
          "Pending",

      };

      const res =
        await fetch(
          "/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              orderData
            ),
          }
        );

      const data =
        await res.json();

      if (data.success) {

        clearCart();

        router.push(
          "/order-success"
        );

      } else {

        alert(
          "Order failed"
        );

      }

    } catch (error) {

      console.log(error);

      alert(
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* HERO */}
      <section className="relative px-6 py-16 border-b border-[#D4AF37]/20">

        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent" />

        <div className="relative max-w-6xl mx-auto text-center">

          <p className="uppercase tracking-[6px] text-[#D4AF37] text-xs mb-5">

            ANAMYST Checkout

          </p>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">

            Secure Checkout

          </h1>

          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-8">

            Complete your luxury fragrance order
            with confidence and secure checkout.

          </p>

        </div>

      </section>

      {/* CONTENT */}
      <section className="px-4 md:px-6 py-14">

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[36px] backdrop-blur-xl p-6 md:p-8">

            <h2 className="text-4xl font-bold text-white mb-10">

              Billing Details

            </h2>

            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37] text-white placeholder:text-gray-500 transition"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37] text-white placeholder:text-gray-500 transition"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37] text-white placeholder:text-gray-500 transition"
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37] text-white placeholder:text-gray-500 transition"
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37] text-white placeholder:text-gray-500 transition"
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={form.pincode}
                onChange={handleChange}
                className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37] text-white placeholder:text-gray-500 transition"
              />

            </div>

            {/* ADDRESS */}
            <textarea
              name="address"
              placeholder="Full Address"
              value={form.address}
              onChange={handleChange}
              rows={5}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37] text-white placeholder:text-gray-500 transition mt-6"
            />

            {/* PAYMENT */}
            <div className="mt-10">

              <h2 className="text-3xl font-bold text-white mb-5">

                Payment Method

              </h2>

              <label className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-2xl p-5">

                <input
                  type="radio"
                  checked
                  readOnly
                  className="accent-[#D4AF37]"
                />

                <span className="text-white font-medium text-lg">

                  Cash on Delivery

                </span>

              </label>

            </div>

          </div>

          {/* RIGHT */}
          <div>

            <div className="bg-white/5 border border-white/10 rounded-[36px] backdrop-blur-xl p-6 sticky top-24">

              <h2 className="text-3xl font-bold text-white mb-8">

                Order Summary

              </h2>

              {/* ITEMS */}
              <div className="space-y-5">

                {cart.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={`${item._id}-${index}`}
                      className="flex gap-4 border-b border-white/10 pb-5"
                    >

                      <div className="bg-black/40 rounded-2xl overflow-hidden">

                        <Image
                          src={item.image}
                          alt={item.name}
                          width={90}
                          height={90}
                          className="object-contain w-auto h-auto"
                        />

                      </div>

                      <div className="flex-1">

                        <h3 className="text-white font-semibold text-lg">

                          {item.name}

                        </h3>

                        <p className="text-gray-400 text-sm">

                          Qty:
                          {" "}
                          {item.quantity}

                        </p>

                        <p className="text-[#D4AF37] font-bold mt-2 text-lg">

                          ₹
                          {item.price *
                            item.quantity}

                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

              {/* TOTAL */}
              <div className="flex items-center justify-between mt-8">

                <span className="text-2xl font-bold text-white">

                  Total

                </span>

                <span className="text-4xl font-bold text-[#D4AF37]">

                  ₹{total}

                </span>

              </div>

              {/* BUTTON */}
              <button
                onClick={placeOrder}
                disabled={loading}
                className="w-full mt-8 bg-[#D4AF37] text-black py-5 rounded-2xl text-lg font-bold hover:opacity-90 transition duration-300"
              >

                {loading
                  ? "Placing Order..."
                  : "Place Order"}

              </button>

              {/* TRUST */}
              <div className="mt-8 bg-black/40 border border-white/10 rounded-[24px] p-5 space-y-4 text-gray-300">

                <p>
                  🚚 Shipping Across India
                </p>

                <p>
                  🔒 Secure Checkout
                </p>

                <p>
                  💯 Authentic Luxury Fragrance
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>

  );

}