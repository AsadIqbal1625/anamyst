"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black">

      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Right Section */}
      <div className="flex-1 flex flex-col min-w-0">

        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
