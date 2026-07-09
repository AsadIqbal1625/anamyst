"use client";

import { usePathname } from "next/navigation";

export default function AdminTopbar({ onMenuClick = () => {} }) {

  const pathname = usePathname();

  const pageName =
    pathname
      .split("/")
      .filter(Boolean)
      .pop() || "admin";

  return (

    <header className="h-20 border-b border-[#D4AF37]/20 bg-[#111] flex items-center justify-between px-4 md:px-8 gap-4">

      <div className="flex items-center gap-4 min-w-0">

        {/* HAMBURGER (mobile only) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-white text-2xl shrink-0"
        >
          ☰
        </button>

        <div className="min-w-0">

          <h2 className="text-xl md:text-3xl font-bold capitalize text-white truncate">

            {pageName === "admin"
              ? "Dashboard"
              : pageName}

          </h2>

          <p className="text-sm text-gray-400 hidden sm:block">

            Welcome back to ANAMYST Admin

          </p>

        </div>

      </div>

      <div className="flex items-center gap-5" />

    </header>

  );

}
