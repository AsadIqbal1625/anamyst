"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CustomersPage() {

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {

    async function fetchCustomers() {

      try {

        const res = await fetch("/api/customers");
        const data = await res.json();

        if (data.success) {
          setCustomers(data.customers);
        }

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }

    fetchCustomers();

  }, []);

  const filtered = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(search.toLowerCase()) ||
      customer.mobile?.includes(search)
  );

  return (

      <div className="text-white">

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">

          <input
            type="text"
            placeholder="Search by Name or Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl bg-[#111] border border-[#D4AF37]/30 px-5 py-3 outline-none"
          />

          {/* file download, not a page nav — <Link> would be wrong here */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/customers/export"
            className="bg-white/10 border border-[#D4AF37]/40 hover:bg-white/20 text-white px-5 py-3 rounded-xl text-sm font-semibold transition whitespace-nowrap"
          >
            Download Customers (Excel)
          </a>

        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#D4AF37]/20">

          <table className="w-full">

            <thead className="bg-[#111]">

              <tr>

                <th className="text-left p-4">Customer ID</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Mobile</th>
                <th className="text-left p-4">City</th>
                <th className="text-left p-4">Orders</th>
                <th className="text-left p-4">Spent</th>
                <th className="text-left p-4">Last Order</th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan={7}
                    className="text-center p-8"
                  >
                    Loading...
                  </td>

                </tr>

              ) : filtered.length === 0 ? (

                <tr>

                  <td
                    colSpan={7}
                    className="text-center p-8"
                  >
                    No Customers Found
                  </td>

                </tr>

              ) : (

                filtered.map((customer) => (

                  <tr
                    key={customer._id}
                    className="border-t border-[#D4AF37]/10 hover:bg-[#111]"
                  >

                    <td className="p-4 font-semibold text-[#D4AF37]">
                      <Link
                        href={`/admin/customers/${customer.customerId}`}
                        className="hover:underline"
                      >
                        {customer.customerId}
                      </Link>
                    </td>

                    <td className="p-4">
                      <Link
                        href={`/admin/customers/${customer.customerId}`}
                        className="hover:underline hover:text-[#D4AF37]"
                      >
                        {customer.name}
                      </Link>
                    </td>

                    <td className="p-4">
                      {customer.mobile}
                    </td>

                    <td className="p-4">
                      {customer.city}
                    </td>

                    <td className="p-4">
                      {customer.totalOrders}
                    </td>

                    <td className="p-4">
                      ₹{customer.totalSpent}
                    </td>

                    <td className="p-4">
                      {new Date(customer.lastOrderDate).toLocaleDateString()}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

  );

}