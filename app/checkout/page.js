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

import { getOrderTotals } from "../../lib/pricing";

import { getSessionId } from "../../lib/track";

import toast from "react-hot-toast";

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

  const [codEnabled,
    setCodEnabled] =
    useState(true);

  const [settings,
    setSettings] =
    useState({ shippingFee: 0, discountTiers: [] });

  /* NOTIFICATION PREFERENCES */

  const [notifyEmail,
    setNotifyEmail] =
    useState(true);

  const [notifyWhatsapp,
    setNotifyWhatsapp] =
    useState(false);

  /* STORE SETTINGS (COD availability) */

  useEffect(() => {

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {

        if (data.success && data.settings) {

          setSettings(data.settings);

          if (data.settings.codEnabled === false) {

            setCodEnabled(false);

            setPaymentMethod("RAZORPAY");

          }

        }

      })
      .catch(() => {});

  }, []);

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

  /* ABANDONED-CHECKOUT CAPTURE — after the visitor types a contact,
     save their cart server-side (debounced, fire-and-forget) */

  useEffect(() => {

    const phoneOk =
      form.phone.replace(/\D/g, "").length >= 10;

    const emailOk =
      /^\S+@\S+\.\S+$/.test(form.email);

    if ((!phoneOk && !emailOk) || cart.length === 0) return;

    const t = setTimeout(() => {

      fetch("/api/abandoned-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          /* same session id the cart snapshots use, so this enriches
             that record instead of creating a second one */
          sessionId: getSessionId(),
          name: form.name,
          phone: form.phone,
          email: form.email,
          cart,
        }),
      }).catch(() => {});

    }, 2000);

    return () => clearTimeout(t);

  }, [form.name, form.phone, form.email, cart]);

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

  /* COUPON */

  const [couponInput,
    setCouponInput] =
    useState("");

  const [appliedCoupon,
    setAppliedCoupon] =
    useState(null);

  const [discount,
    setDiscount] =
    useState(0);

  const [applying,
    setApplying] =
    useState(false);

  /* FULL BREAKDOWN — one shared calculation, also run server-side on
     the order API so the shown price always matches what is charged */

  const totals = useMemo(
    () =>
      getOrderTotals({
        subtotal: total,
        tiers: settings.discountTiers,
        shippingFee: settings.shippingFee,
        codFee: settings.codFee,
        paymentMethod,
        couponCode: appliedCoupon?.code || "",
        couponDiscount: discount,
      }),
    [
      total,
      settings.discountTiers,
      settings.shippingFee,
      settings.codFee,
      paymentMethod,
      appliedCoupon,
      discount,
    ]
  );

  const payable = totals.total;

  async function applyCoupon() {

    if (!couponInput.trim()) {

      toast.error(
        "Please enter a coupon code"
      );

      return;

    }

    setApplying(true);

    try {

      const res = await fetch(
        "/api/coupons/validate",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            code: couponInput,
            total,
          }),
        }
      );

      const data =
        await res.json();

      if (data.success) {

        setAppliedCoupon(
          data.coupon
        );

        setDiscount(
          data.discount
        );

        toast.success(
          `Coupon applied — you save ₹${data.discount}`
        );

      } else {

        setAppliedCoupon(null);

        setDiscount(0);

        toast.error(
          data.error ||
            "Invalid coupon"
        );

      }

    } catch {

      toast.error(
        "Could not apply coupon"
      );

    } finally {

      setApplying(false);

    }

  }

  function removeCoupon() {

    setAppliedCoupon(null);

    setDiscount(0);

    setCouponInput("");

  }

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

        toast.error(
          "Please fill all fields"
        );

        return;

      }

      if (!notifyEmail && !notifyWhatsapp) {

        toast.error(
          "Please select at least one way to be notified about your order"
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
              cart.map((item) => ({
                ...item,
                productId: item._id,
              })),

            totalAmount:
              payable,

            couponCode:
              appliedCoupon?.code || "",

            discount:
              totals.discount,

            discountLabel:
              totals.discountLabel,

            shippingCost:
              totals.shippingCost,

            codFee:
              totals.codCharge,

            paymentMethod:
              "COD",

            paymentStatus:
              "Pending",

            orderStatus:
              "Pending",

            notifyEmail,

            notifyWhatsapp,

            /* lets the server close out this session's abandoned cart */
            sessionId: getSessionId(),

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

              /* the amount is priced server-side from these — sending
                 a total here would let a tampered client set it */
              body:
                JSON.stringify({

                  products: cart.map((item) => ({
                    productId: item._id,
                    quantity: item.quantity,
                  })),

                  couponCode:
                    appliedCoupon?.code || "",

                }),

            }
          );

        const razorpayData =
          await razorpayRes.json();

        if (
          !razorpayData.success ||
          !razorpayData.order
        ) {

          toast.error(
            razorpayData.error ||
              "Could not start the payment. Please try again."
          );

          setLoading(false);

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

                toast.error(
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
                  cart.map((item) => ({
                    ...item,
                    productId: item._id,
                  })),

                totalAmount:
                  payable,

                couponCode:
                  appliedCoupon?.code || "",

                discount:
                  totals.discount,

                discountLabel:
                  totals.discountLabel,

                shippingCost:
                  totals.shippingCost,

                codFee: 0,

                paymentMethod:
                  "RAZORPAY",

                razorpayOrderId:
                  response
                    .razorpay_order_id,

                paymentId:
                  response
                    .razorpay_payment_id,

                razorpaySignature:
                  response
                    .razorpay_signature,

                paymentStatus:
                  "Paid",

                orderStatus:
                  "Pending",

                notifyEmail,

                notifyWhatsapp,

                /* lets the server close out this session's abandoned cart */
                sessionId: getSessionId(),

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

        toast.error(
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

              {/* NOTIFICATION PREFERENCES */}
              <div className="mt-6 bg-black border border-white/10 rounded-2xl p-5">

                <p className="text-sm text-gray-400 mb-4">

                  How should we notify you about your order?

                </p>

                <div className="flex flex-col gap-3">

                  <label className="flex items-center gap-3 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={notifyEmail}
                      onChange={(e) =>
                        setNotifyEmail(e.target.checked)
                      }
                      className="w-5 h-5 accent-[#D4AF37]"
                    />

                    <span>Notify by Email</span>

                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">

                    <input
                      type="checkbox"
                      checked={notifyWhatsapp}
                      onChange={(e) =>
                        setNotifyWhatsapp(e.target.checked)
                      }
                      className="w-5 h-5 accent-[#D4AF37]"
                    />

                    <span>Notify by WhatsApp</span>

                  </label>

                </div>

              </div>

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

                      <div className="relative w-[72px] h-[72px] bg-[#111] rounded-2xl overflow-hidden shrink-0">

                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          loading="lazy"
                          sizes="72px"
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

                    ...(codEnabled
                      ? [
                          {
                            id: "COD",

                            title:
                              "Cash On Delivery",

                            desc:
                              Number(settings.codFee) > 0
                                ? `Pay after delivery · +₹${Number(
                                    settings.codFee
                                  )} fee`
                                : "Pay after delivery",
                          },
                        ]
                      : []),

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

              {/* COUPON */}

              <div className="mt-8">

                <p className="uppercase tracking-[3px] text-[#D4AF37] text-[10px] mb-3">

                  Have a coupon?

                </p>

                {appliedCoupon ? (

                  <div className="flex items-center justify-between bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-2xl px-4 py-3">

                    <div>

                      <p className="text-[#D4AF37] font-semibold text-sm">

                        {appliedCoupon.code} applied

                      </p>

                      <p className="text-green-400 text-xs mt-0.5">

                        You save ₹{totals.discount}

                      </p>

                      <p className="text-gray-500 text-[11px] mt-1 leading-relaxed">

                        Coupon used instead of the occasion offer — the
                        two can&apos;t be combined.

                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-gray-400 hover:text-red-400 text-xs uppercase tracking-[2px] transition"
                    >

                      Remove

                    </button>

                  </div>

                ) : (

                  <div className="flex gap-3">

                    <input
                      value={couponInput}
                      onChange={(e) =>
                        setCouponInput(
                          e.target.value.toUpperCase()
                        )
                      }
                      placeholder="Enter code"
                      className="flex-1 bg-black border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#D4AF37] transition uppercase"
                    />

                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={applying}
                      className="px-5 py-3 rounded-2xl border border-[#D4AF37]/50 text-[#D4AF37] text-sm font-semibold hover:bg-[#D4AF37] hover:text-black transition disabled:opacity-50"
                    >

                      {applying
                        ? "..."
                        : "Apply"}

                    </button>

                  </div>

                )}

              </div>

              {/* TOTAL */}

              <div className="border-t border-white/10 mt-8 pt-6">

                <div className="flex items-center justify-between text-sm mb-3">

                  <span className="text-gray-400">

                    Subtotal

                  </span>

                  <span className="text-gray-400">

                    ₹{total}

                  </span>

                </div>

                {totals.discount > 0 && (

                  <div className="flex items-center justify-between text-sm mb-3">

                    <span className="text-green-400">

                      Discount
                      {totals.discountLabel &&
                        ` (${totals.discountLabel})`}

                    </span>

                    <span className="text-green-400">

                      −₹{totals.discount}

                    </span>

                  </div>

                )}

                <div className="flex items-center justify-between text-sm mb-3">

                  <span className="text-gray-400">

                    Shipping

                  </span>

                  <span
                    className={
                      totals.shippingCost === 0
                        ? "text-green-400"
                        : "text-gray-400"
                    }
                  >

                    {totals.shippingCost === 0
                      ? "Free"
                      : `₹${totals.shippingCost}`}

                  </span>

                </div>

                {totals.codCharge > 0 && (

                  <div className="flex items-center justify-between text-sm mb-3">

                    <span className="text-gray-400">

                      Cash on Delivery fee

                    </span>

                    <span className="text-gray-400">

                      +₹{totals.codCharge}

                    </span>

                  </div>

                )}

                {totals.codCharge > 0 && (

                  <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">

                    Pay online to avoid the ₹{totals.codCharge} Cash on
                    Delivery fee.

                  </p>

                )}

                <div className="flex items-center justify-between">

                  <span className="text-xl font-semibold">

                    Total

                  </span>

                  <span className="text-3xl font-bold text-[#D4AF37]">

                    ₹{payable}

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