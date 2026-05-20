"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter }
from "next/navigation";

import Image from "next/image";

import {
  getCart,
  clearCart,
} from "../../lib/cart";

export default function CheckoutPage() {

  const router = useRouter();

  const [cart, setCart] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",

    });

  /* LOAD CART */
  useEffect(() => {

    setCart(getCart());

  }, []);

  /* TOTAL */
  const total = cart.reduce(

    (sum, item) =>

      sum +
      item.price *
        item.quantity,

    0

  );

  /* HANDLE CHANGE */
  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };

  /* PLACE ORDER */
  const placeOrder =
    async () => {

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

      if (cart.length === 0) {

        alert(
          "Your cart is empty"
        );

        return;

      }

      setLoading(true);

      try {

        const orderData = {

          customerName:
            form.name,

          email:
            form.email,

          phone:
            form.phone,

          address:
            form.address,

          city:
            form.city,

          state:
            form.state,

          pincode:
            form.pincode,

          products:
            cart.map(
              (item) => ({

                productId:
                  item._id,

                name:
                  item.name,

                image:
                  item.image,

                quantity:
                  item.quantity,

                price:
                  item.price,

              })
            ),

          totalAmount:
            total,

          paymentMethod:
            "COD",

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
            data.error
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

    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-[#faf7f2] to-[#f3f3f3] px-4 py-10">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
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
              className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black text-black placeholder:text-gray-500"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black text-black placeholder:text-gray-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black text-black placeholder:text-gray-500"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black text-black placeholder:text-gray-500"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black text-black placeholder:text-gray-500"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black text-black placeholder:text-gray-500"
            />

          </div>

          {/* ADDRESS */}
          <textarea
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black text-black placeholder:text-gray-500 mt-6"
          />

          {/* PAYMENT */}
          <div className="mt-10">

            <h2 className="text-2xl font-bold text-black mb-5">

              Payment Method

            </h2>

            <label className="flex items-center gap-3 border border-gray-300 rounded-2xl p-4">

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

        {/* RIGHT */}
        <div>

          <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-24">

            <h2 className="text-3xl font-bold text-black mb-8">

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
                    className="flex gap-4 border-b pb-5"
                  >

                    <div className="bg-[#f8f8f8] rounded-2xl overflow-hidden">

                      <Image
                    src={item.image}
                    alt={item.name}
                    width={90}
                    height={90}
                    className="object-contain w-auto h-auto"
                  />

                    </div>

                    <div className="flex-1">

                      <h3 className="text-black font-semibold text-lg">

                        {item.name}

                      </h3>

                      <p className="text-gray-500 text-sm">

                        Qty:
                        {" "}
                        {item.quantity}

                      </p>

                      <p className="text-black font-bold mt-2">

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
              disabled={loading}
              className="w-full mt-8 bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:bg-[#D4AF37] hover:text-black transition duration-300"
            >

              {loading
                ? "Placing Order..."
                : "Place Order"}

            </button>

            {/* TRUST */}
            <div className="mt-8 space-y-3 text-gray-600">

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

    </div>

  );

}