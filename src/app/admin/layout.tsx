import { Suspense } from "react";
import AdminLayoutClient from "@/components/AdminLayoutClient";

export const metadata = {
  title: "Admin Dashboard | Gulshan Grocery",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9F9F9]" />}>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </Suspense>
  );
}