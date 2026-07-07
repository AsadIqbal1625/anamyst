"use client";

import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-black">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col">

        <AdminTopbar />

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>

      </div>

    </div>
  );
}