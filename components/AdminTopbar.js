"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminTopbar() {

  const pathname = usePathname();

  const pageName =
    pathname
      .split("/")
      .filter(Boolean)
      .pop() || "admin";

  return (

    <header className="h-20 border-b border-[#D4AF37]/20 bg-[#111] flex items-center justify-between px-8">

      <div>

        <h2 className="text-3xl font-bold capitalize text-white">

          {pageName === "admin"
            ? "Dashboard"
            : pageName}

        </h2>

        <p className="text-sm text-gray-400">

          Welcome back to ANAMYST Admin

        </p>

      </div>

      <div className="flex items-center gap-5">

        {pathname === "/admin/products" && (

          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-semibold hover:opacity-90 transition"
          >

            + Add Product

          </Link>

        )}

      </div>

    </header>

  );

}