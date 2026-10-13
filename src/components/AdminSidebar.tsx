"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  ShoppingCart,
  Users,
  Settings,
  Store,
} from "lucide-react";

const MENU = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-[#e5e5e5] bg-white p-6">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 border-b border-[#e5e5e5] pb-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBC617] text-xl font-bold text-[#1a1a1a]">
          🛒
        </span>
        <div>
          <h2 className="font-bold text-[#1a1a1a]">Admin Panel</h2>
          <p className="text-xs text-[#6b6b6b]">Gulshan Grocery</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 flex flex-1 flex-col gap-2">
        {MENU.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-[#1E7F57] text-white shadow-sm"
                  : "text-[#6b6b6b] hover:bg-[#F9F9F9] hover:text-[#1a1a1a]"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Link */}
      <div className="border-t border-[#e5e5e5] pt-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-[#1E7F57] transition hover:bg-[#E8F3EE]"
        >
          <Store size={18} />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}