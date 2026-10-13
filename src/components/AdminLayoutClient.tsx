"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // লগইন পেজে সাইডবার বা হেডার দেখাবে না
  if (isLoginPage) {
    return <div className="min-h-screen bg-[#F9F9F9]">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F9F9F9]">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Admin Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#e5e5e5] bg-white px-8">
          <h1 className="text-sm font-semibold text-[#6b6b6b]">
            Welcome back, <span className="font-bold text-[#1a1a1a]">Admin</span>
          </h1>

          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FBC617] text-sm font-bold text-[#1a1a1a]">
              A
            </span>
            <span className="text-sm font-bold text-[#1a1a1a]">
              Gulshan Admin
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}