"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Image from "next/image";

import Script from "next/script";

import { useRouter }
from "next/navigation";

import {
  getCart,
  clearCart,
} from "../../lib/cart";

export default function CheckoutPage() {

  const router =
    useRouter();

  const [cart,
    setCart] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  const [paymentMethod,
    setPaymentMethod] =
    useState("RAZORPAY");

  const [mounted,
    setMounted] =
    useState(false);

  const [form,
    setForm] =
    useState({

      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",

    });

  useEffect(() => {

    setMounted(true);

    const cartItems =
      getCart();

    if (
      !cartItems ||
      cartItems.length === 0
    ) {

      router.push("/cart");

      return;

    }

    setCart(cartItems);

  }, [router]);

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };

  const total = useMemo(() => {

    return cart.reduce(

      (sum, item) => {

        const price =
          Number(item.price) || 0;

        const quantity =
          Number(item.quantity) || 1;

        return (
          sum +
          price * quantity
        );

      },

      0

    );

  }, [cart]);

  if (!mounted) return null;

  const placeOrder =
    async () => {

      if (

        !form.name ||
        !form.email ||
        !form.phone ||
        !form.address ||
        !form.city ||
        !form.state ||
        !form.pincode

      ) {

        alert(
          "Please fill all fields"
        );

        return;

      }

      try {

        setLoading(true);

        /* COD */

        if (
          paymentMethod ===
          "COD"
        ) {

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
              cart,

            totalAmount:
              total,

            paymentMethod:
              "COD",

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

                body:
                  JSON.stringify(
                    orderData
                  ),

              }
            );

          const data =
            await res.json();

          if (data.success) {

            clearCart();

            router.push(

              `/order-success?orderId=${data.order.orderId}`

            );

          }

          return;

        }

        /* RAZORPAY */

        const razorpayRes =
          await fetch(
            "/api/razorpay",
            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body:
                JSON.stringify({

                  amount: total,

                }),

            }
          );

        const razorpayData =
          await razorpayRes.json();

        const order =
          razorpayData.order;

        const options = {

          key:
            process.env
              .NEXT_PUBLIC_RAZORPAY_KEY_ID,

          amount:
            order.amount,

          currency:
            "INR",

          name:
            "ANAMYST",

          description:
            "Luxury Fragrance Order",

          image:
            "/logo.png",

          order_id:
            order.id,

          handler:
            async function (
              response
            ) {

              const verifyRes =
                await fetch(

                  "/api/verify-payment",

                  {

                    method: "POST",

                    headers: {

                      "Content-Type":
                        "application/json",

                    },

                    body:
                      JSON.stringify({

                        razorpay_order_id:
                          response
                            .razorpay_order_id,

                        razorpay_payment_id:
                          response
                            .razorpay_payment_id,

                        razorpay_signature:
                          response
                            .razorpay_signature,

                      }),

                  }

                );

              const verifyData =
                await verifyRes.json();

              if (
                !verifyData.success
              ) {

                alert(
                  "Payment verification failed"
                );

                return;

              }

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
                  cart,

                totalAmount:
                  total,

                paymentMethod:
                  "RAZORPAY",

                razorpayOrderId:
                  response
                    .razorpay_order_id,

                paymentId:
                  response
                    .razorpay_payment_id,

                paymentStatus:
                  "Paid",

                orderStatus:
                  "Pending",

              };

              const res =
                await fetch(
                  "/api/orders",
                  {

                    method:
                      "POST",

                    headers: {

                      "Content-Type":
                        "application/json",

                    },

                    body:
                      JSON.stringify(
                        orderData
                      ),

                  }
                );

              const data =
                await res.json();

              if (
                data.success
              ) {

                clearCart();

                router.push(

                  `/order-success?orderId=${data.order.orderId}`

                );

              }

            },

          theme: {

            color:
              "#D4AF37",

          },

          prefill: {

            name:
              form.name,

            email:
              form.email,

            contact:
              form.phone,

          },

        };

        const paymentObject =
          new window.Razorpay(
            options
          );

        paymentObject.open();

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

    <>

      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-black text-white">

        {/* HERO */}

        <section className="px-6 py-10">

          <div className="max-w-6xl mx-auto text-center">

            <p className="uppercase tracking-[5px] text-[#D4AF37] text-xs mb-4">

              ANAMYST Checkout

            </p>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">

              Secure Checkout

            </h1>

            <p className="text-gray-400 max-w-2xl mx-auto">

              Complete your luxury fragrance order with secure payment and fast delivery.

            </p>

          </div>

        </section>

        {/* MAIN */}

        <section className="px-4 md:px-6 pb-16">

          <div className="max-w-7xl mx-auto bg-[#0B0B0B] rounded-[32px] overflow-hidden grid lg:grid-cols-3">

            {/* LEFT */}

            <div className="lg:col-span-2 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-white/10">

              <h2 className="text-3xl font-bold mb-8">

                Billing Details

              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                {[
                  {
                    name: "name",
                    placeholder:
                      "Full Name",
                  },

                  {
                    name: "phone",
                    placeholder:
                      "Phone Number",
                  },

                  {
                    name: "email",
                    placeholder:
                      "Email Address",
                  },

                  {
                    name: "city",
                    placeholder:
                      "City",
                  },

                  {
                    name: "state",
                    placeholder:
                      "State",
                  },

                  {
                    name: "pincode",
                    placeholder:
                      "Pincode",
                  },

                ].map((field) => (

                  <input
                    key={field.name}
                    type="text"
                    name={field.name}
                    placeholder={
                      field.placeholder
                    }
                    value={
                      form[field.name]
                    }
                    onChange={
                      handleChange
                    }
                    className="bg-black border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-[#D4AF37] transition"
                  />

                ))}

              </div>

              <textarea
                name="address"
                placeholder="Full Address"
                value={form.address}
                onChange={handleChange}
                rows={5}
                className="w-full mt-5 bg-black border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-[#D4AF37]"
              />

            </div>

            {/* RIGHT */}

            <div className="p-6 md:p-8 bg-black/40">

              <h2 className="text-2xl font-bold mb-8">

                Order Summary

              </h2>

              <div className="space-y-5">

                {cart.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={`${item._id}-${index}`}
                      className="flex gap-4"
                    >

                      <div className="bg-[#111] rounded-2xl overflow-hidden shrink-0">

                        <Image
                          src={item.image}
                          alt={item.name}
                          width={72}
                          height={72}
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-contain"
                        />

                      </div>

                      <div className="flex-1">

                        <h3 className="font-semibold">

                          {item.name}

                        </h3>

                        <p className="text-sm text-gray-400">

                          Qty:
                          {" "}
                          {item.quantity}

                        </p>

                        <p className="text-[#D4AF37] font-bold mt-1">

                          ₹
                          {Number(
                            item.price
                          ) *
                            Number(
                              item.quantity
                            )}

                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

              {/* PAYMENT */}

              <div className="mt-10">

                <h3 className="text-xl font-bold mb-4">

                  Payment Method

                </h3>

                <div className="space-y-4">

                  {[
                    {
                      id:
                        "RAZORPAY",

                      title:
                        "Pay Online",

                      desc:
                        "UPI, Cards & Netbanking",
                    },

                    {
                      id: "COD",

                      title:
                        "Cash On Delivery",

                      desc:
                        "Pay after delivery",
                    },

                  ].map((method) => (

                    <button
                      key={method.id}
                      type="button"
                      onClick={() =>
                        setPaymentMethod(
                          method.id
                        )
                      }
                      className={`w-full rounded-2xl p-4 text-left border transition ${
                        paymentMethod ===
                        method.id

                          ? "border-[#D4AF37] bg-[#D4AF37]/10"

                          : "border-white/10 bg-black"
                      }`}
                    >

                      <h4 className="font-semibold">

                        {method.title}

                      </h4>

                      <p className="text-sm text-gray-400 mt-1">

                        {method.desc}

                      </p>

                    </button>

                  ))}

                </div>

              </div>

              {/* TOTAL */}

              <div className="border-t border-white/10 mt-10 pt-6">

                <div className="flex items-center justify-between">

                  <span className="text-xl font-semibold">

                    Total

                  </span>

                  <span className="text-3xl font-bold text-[#D4AF37]">

                    ₹{total}

                  </span>

                </div>

                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="w-full mt-6 bg-[#D4AF37] text-black py-4 rounded-2xl font-semibold hover:opacity-90 transition"
                >

                  {loading

                    ? "Processing..."

                    : paymentMethod ===
                      "COD"

                    ? "Place COD Order"

                    : "Proceed To Payment"}

                </button>

              </div>

            </div>

          </div>

        </section>

      </div>

    </>

  );

}