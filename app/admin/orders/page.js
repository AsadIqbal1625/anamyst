"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

export default function AdminOrdersPage() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedStatus,
    setSelectedStatus] =
    useState("All");

  /* FETCH ORDERS */
  async function fetchOrders() {

    try {

      const res =
        await fetch(
          "/api/orders"
        );

      const data =
        await res.json();

      if (data.success) {

        setOrders(
          data.orders
        );

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    fetchOrders();

  }, []);

  /* UPDATE STATUS */
  async function updateStatus(
    orderId,
    status
  ) {

    try {

      const res =
        await fetch(

          `/api/orders/${orderId}`,

          {

            method: "PATCH",

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify({

              orderStatus:
                status,

            }),

          }

        );

      const data =
        await res.json();

      if (data.success) {

        fetchOrders();

      }

    } catch (error) {

      console.log(error);

    }

  }

  /* STATUS COLORS */
  function getStatusColor(
    status
  ) {

    switch (status) {

      case "Delivered":

        return "bg-green-100 text-green-700 border border-green-300";

      case "Shipped":

        return "bg-blue-100 text-blue-700 border border-blue-300";

      case "Cancelled":

        return "bg-red-100 text-red-700 border border-red-300";

      default:

        return "bg-yellow-100 text-yellow-700 border border-yellow-300";

    }

  }

  /* FILTERED ORDERS */
  const filteredOrders =

    selectedStatus === "All"

      ? orders

      : orders.filter(

          (order) =>

            order.orderStatus ===
            selectedStatus

        );

  /* LOADING */
  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">

        Loading Orders...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-[#f7f7f7] px-4 py-10">

      <div className="max-w-7xl mx-auto">

        {/* TITLE */}
        <div className="mb-10">

          <h1 className="text-5xl font-bold text-black mb-3">

            Orders Dashboard

          </h1>

          <p className="text-gray-600 text-lg">

            Manage customer orders

          </p>

        </div>

        {/* FILTER BUTTONS */}
        <div className="flex flex-wrap gap-4 mb-10">

          {[
            "All",
            "Pending",
            "Shipped",
            "Delivered",
            "Cancelled",
          ].map((status) => (

            <button
              key={status}
              onClick={() =>
                setSelectedStatus(
                  status
                )
              }
              className={`px-6 py-3 rounded-2xl font-semibold transition duration-300

              ${
                selectedStatus ===
                status

                  ? "bg-black text-white"

                  : "bg-white text-black border border-gray-300 hover:border-black"
              }
              `}
            >

              {status}
              {" "}
              (
              {
                status === "All"

                  ? orders.length

                  : orders.filter(
                      (order) =>
                        order.orderStatus ===
                        status
                    ).length
              }
              )

            </button>

          ))}

        </div>

        {/* EMPTY */}
        {filteredOrders.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

            <h2 className="text-3xl font-bold text-black mb-4">

              No Orders Found 😔

            </h2>

            <p className="text-gray-500">

              No {selectedStatus} orders available.

            </p>

          </div>

        ) : (

          <div className="space-y-8">

            {filteredOrders.map(
              (
                order,
                index
              ) => (

                <div
                  key={`${order._id}-${index}`}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden"
                >

                  {/* HEADER */}
                  <div className="bg-black text-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <h2 className="text-2xl font-bold">

                        {order.customerName}

                      </h2>

                      <p className="text-gray-300 mt-1">

                        {order.email}

                      </p>

                    </div>

                    <div className="flex flex-col items-end gap-3">

                      {/* STATUS */}
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${getStatusColor(order.orderStatus)}`}
                      >

                        {order.orderStatus}

                      </span>

                      {/* DROPDOWN */}
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          updateStatus(
                            order._id,
                            e.target.value
                          )
                        }
                        className="bg-white text-black px-4 py-2 rounded-xl border outline-none"
                      >

                        <option value="Pending">

                          Pending

                        </option>

                        <option value="Shipped">

                          Shipped

                        </option>

                        <option value="Delivered">

                          Delivered

                        </option>

                        <option value="Cancelled">

                          Cancelled

                        </option>

                      </select>

                      <p className="text-sm text-gray-300">

                        {new Date(
                          order.createdAt
                        ).toLocaleString()}

                      </p>

                    </div>

                  </div>

                  {/* BODY */}
                  <div className="p-6">

                    {/* CUSTOMER */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">

                      <div>

                        <h3 className="text-xl font-bold text-black mb-3">

                          Customer Details

                        </h3>

                        <div className="space-y-2 text-gray-700">

                          <p>
                            📞 {order.phone}
                          </p>

                          <p>
                            📍 {order.address}
                          </p>

                          <p>
                            {order.city},{" "}
                            {order.state}
                          </p>

                          <p>
                            PIN:
                            {" "}
                            {order.pincode}
                          </p>

                        </div>

                      </div>

                      <div>

                        <h3 className="text-xl font-bold text-black mb-3">

                          Payment

                        </h3>

                        <div className="space-y-2 text-gray-700">

                          <p>
                            💳 {order.paymentMethod}
                          </p>

                          <p>
                            📦 {order.orderStatus}
                          </p>

                          <p className="text-2xl font-bold text-black mt-4">

                            ₹
                            {order.totalAmount}

                          </p>

                        </div>

                      </div>

                    </div>

                    {/* PRODUCTS */}
                    <div>

                      <h3 className="text-2xl font-bold text-black mb-5">

                        Ordered Products

                      </h3>

                      <div className="space-y-5">

                        {order.products?.map(
                          (
                            item,
                            itemIndex
                          ) => (

                            <div
                              key={`${item.productId}-${itemIndex}`}
                              className="flex gap-5 items-center border border-gray-200 rounded-2xl p-4"
                            >

                              <div className="bg-[#f8f8f8] rounded-2xl overflow-hidden">

                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={100}
                                  height={100}
                                  className="object-contain w-auto h-auto"
                                />

                              </div>

                              <div className="flex-1">

                                <h4 className="text-xl font-semibold text-black">

                                  {item.name}

                                </h4>

                                <p className="text-gray-500 mt-1">

                                  Qty:
                                  {" "}
                                  {item.quantity}

                                </p>

                              </div>

                              <div className="text-right">

                                <p className="text-2xl font-bold text-black">

                                  ₹
                                  {item.price}

                                </p>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

}