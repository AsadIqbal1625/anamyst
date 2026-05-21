
"use client";

import {
  useEffect,
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

  const total =

    cart.reduce(

      (sum, item) =>

        sum +
        item.price *
        item.quantity,

      0

    );

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

        /* ===========================
           CASH ON DELIVERY
        =========================== */

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

            /* WHATSAPP MESSAGE */

            const message =

              `🛍️ *NEW COD ORDER*%0A%0A` +

              `Order ID: ${data.order.orderId}%0A` +

              `Customer: ${form.name}%0A` +

              `Phone: ${form.phone}%0A` +

              `Address: ${form.address}, ${form.city}, ${form.state} - ${form.pincode}%0A%0A` +

              `Total: ₹${total}%0A` +

              `Payment: COD`;

            window.open(

              `https://wa.me/918840305018?text=${message}`,

              "_blank"

            );

            router.push(

              `/order-success?orderId=${data.order.orderId}`

            );

          }

          return;

        }

        /* ===========================
           RAZORPAY
        =========================== */

        if (
          !window.Razorpay
        ) {

          alert(
            "Razorpay SDK failed to load"
          );

          return;

        }

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

        if (
          !razorpayData.success
        ) {

          alert(
            razorpayData.error ||
            "Payment initialization failed"
          );

          return;

        }

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

          method: {

            upi: true,

            card: true,

            netbanking: true,

            wallet: true,

          },

          handler:
            async function (
              response
            ) {

              try {

                /* VERIFY PAYMENT */

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

                /* SAVE ORDER */

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

                  /* WHATSAPP MESSAGE */

                  const message =

                    `💳 *NEW PAID ORDER*%0A%0A` +

                    `Order ID: ${data.order.orderId}%0A` +

                    `Customer: ${form.name}%0A` +

                    `Phone: ${form.phone}%0A` +

                    `Total: ₹${total}%0A` +

                    `Payment: Paid Online`;

                  window.open(

                    `https://wa.me/918840305018?text=${message}`,

                    "_blank"

                  );

                  router.push(

                    `/order-success?orderId=${data.order.orderId}`

                  );

                } else {

                  alert(
                    "Order save failed"
                  );

                }

              } catch (error) {

                console.log(
                  error
                );

                alert(
                  "Payment success but order save failed"
                );

              }

            },

          modal: {

            ondismiss:
              function () {

                console.log(
                  "Payment popup closed"
                );

              },

          },

          prefill: {

            name:
              form.name,

            email:
              form.email,

            contact:
              form.phone,

          },

          theme: {

            color:
              "#D4AF37",

          },

        };

        const paymentObject =
          new window.Razorpay(
            options
          );

        paymentObject.on(

          "payment.failed",

          function (
            response
          ) {

            console.log(
              response
            );

            alert(

              response.error
                .description

            );

          }

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

      <div className="min-h-screen bg-black text-white overflow-hidden">

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

        <section className="px-4 md:px-6 py-14">

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[36px] backdrop-blur-xl p-6 md:p-8">

              <h2 className="text-4xl font-bold text-white mb-10">

                Billing Details

              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37] text-white"
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37] text-white"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37] text-white"
                />

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37] text-white"
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37] text-white"
                />

                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37] text-white"
                />

              </div>

              <textarea
                name="address"
                placeholder="Full Address"
                value={form.address}
                onChange={handleChange}
                rows={5}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#D4AF37] text-white mt-6"
              />

            </div>

            {/* RIGHT */}
            <div>

              <div className="bg-white/5 border border-white/10 rounded-[36px] backdrop-blur-xl p-6 sticky top-24">

                <h2 className="text-3xl font-bold text-white mb-8">

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
                        className="flex gap-4 border-b border-white/10 pb-5"
                      >

                        <div className="bg-black/40 rounded-2xl overflow-hidden">

                          <Image
                            src={item.image}
                            alt={item.name}
                            width={90}
                            height={90}
                            className="object-contain"
                          />

                        </div>

                        <div className="flex-1">

                          <h3 className="text-white font-semibold text-lg">

                            {item.name}

                          </h3>

                          <p className="text-gray-400 text-sm">

                            Qty: {item.quantity}

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

                {/* PAYMENT METHODS */}

                <div className="mt-8">

                  <h3 className="text-2xl font-bold text-white mb-5">

                    Payment Method

                  </h3>

                  <div className="grid gap-4">

                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMethod(
                          "RAZORPAY"
                        )
                      }
                      className={`border rounded-2xl p-5 text-left transition ${
                        paymentMethod ===
                        "RAZORPAY"

                          ? "border-[#D4AF37] bg-[#D4AF37]/10"

                          : "border-white/10 bg-black/30"
                      }`}
                    >

                      <h4 className="text-xl font-semibold text-white">

                        Pay Online

                      </h4>

                      <p className="text-gray-400 mt-2">

                        UPI, Cards,
                        Netbanking

                      </p>

                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMethod(
                          "COD"
                        )
                      }
                      className={`border rounded-2xl p-5 text-left transition ${
                        paymentMethod ===
                        "COD"

                          ? "border-[#D4AF37] bg-[#D4AF37]/10"

                          : "border-white/10 bg-black/30"
                      }`}
                    >

                      <h4 className="text-xl font-semibold text-white">

                        Cash On Delivery

                      </h4>

                      <p className="text-gray-400 mt-2">

                        Pay when order arrives

                      </p>

                    </button>

                  </div>

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
                  className="w-full mt-8 bg-[#D4AF37] text-black py-5 rounded-2xl text-lg font-bold hover:opacity-90 transition"
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