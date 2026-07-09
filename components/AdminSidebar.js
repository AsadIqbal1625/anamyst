"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menus = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: "🏠",
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: "📦",
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: "🛒",
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: "👥",
  },
  {
    title: "Invoices",
    href: "/admin/invoices",
    icon: "🧾",
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: "📊",
  },
  {
    title: "Marketing",
    href: "/admin/marketing",
    icon: "📢",
  },
  {
    title: "Testimonials",
    href: "/admin/testimonials",
    icon: "💬",
  },
  {
    title: "Notices",
    href: "/admin/notices",
    icon: "📰",
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: "⚙",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.push("/admin-login");
  }

  return (
    <aside className="w-72 min-h-screen bg-[#111] border-r border-[#D4AF37]/20 flex flex-col">

      <div className="p-8">

        <h1 className="font-brand text-3xl text-white tracking-widest">
          ANAMYST
        </h1>

        <p className="text-[#D4AF37] text-sm mt-2">
          Admin Dashboard
        </p>

      </div>

      <nav className="px-4 flex-1">

        {menus.map((menu) => (

          <Link
            key={menu.href}
            href={menu.href}
            className={`flex items-center gap-3 px-5 py-4 rounded-xl mb-2 transition

            ${
              pathname === menu.href
                ? "bg-[#D4AF37] text-black font-semibold"
                : "text-gray-300 hover:bg-[#D4AF37]/10 hover:text-white"
            }
            `}
          >
            <span className="text-xl">
              {menu.icon}
            </span>

            <span>
              {menu.title}
            </span>

          </Link>

        ))}

      </nav>

      <div className="p-4 border-t border-white/10">

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-4 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
        >
          <span className="text-xl">
            🚪
          </span>

          <span>
            Logout
          </span>
        </button>

      </div>

    </aside>
  );
}