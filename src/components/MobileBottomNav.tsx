"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, LayoutGrid, User, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";

// Hydration safe connection for Cart Badge
const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const totalItems = useCartStore((s) => s.totalItems());

  // Check active routes
  const isHome = pathname === "/";
  const isShop = pathname === "/shop";
  const isCategory = pathname.includes("category");
  const isProfile = pathname.includes("/account") || pathname.includes("/login");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-between border-t border-[#e5e5e5] bg-white px-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden">
      
      {/* 1. Home */}
      <Link
        href="/"
        className={`flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors ${
          isHome ? "text-[#1E7F57]" : "text-[#6b6b6b] hover:text-[#1E7F57]"
        }`}
      >
        <Home size={20} className={isHome ? "fill-[#1E7F57]/10" : ""} />
        <span className="text-[10px] font-bold">Home</span>
      </Link>

      {/* 2. Category */}
      <Link
        href="/shop?category=fresh-fruits"
        className={`flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors ${
          isCategory && !isShop ? "text-[#1E7F57]" : "text-[#6b6b6b] hover:text-[#1E7F57]"
        }`}
      >
        <LayoutGrid size={20} className={isCategory && !isShop ? "fill-[#1E7F57]/10" : ""} />
        <span className="text-[10px] font-bold">Category</span>
      </Link>

      {/* 3. Floating Center Cart Button */}
      <div className="relative flex h-full flex-1 items-center justify-center">
        <Link
          href="/cart"
          className="absolute -top-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#1E7F57] text-white shadow-lg ring-4 ring-white transition-transform hover:scale-105 active:scale-95"
        >
          <ShoppingBag size={24} />
          {hydrated && totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FBC617] px-1 text-[11px] font-bold text-[#1a1a1a] shadow-md border-2 border-white">
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      {/* 4. Shop */}
      <Link
        href="/shop"
        className={`flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors ${
          isShop ? "text-[#1E7F57]" : "text-[#6b6b6b] hover:text-[#1E7F57]"
        }`}
      >
        <Store size={20} className={isShop ? "fill-[#1E7F57]/10" : ""} />
        <span className="text-[10px] font-bold">Shop</span>
      </Link>

      {/* 5. Profile */}
      <Link
        href="/account"
        className={`flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors ${
          isProfile ? "text-[#1E7F57]" : "text-[#6b6b6b] hover:text-[#1E7F57]"
        }`}
      >
        <User size={20} className={isProfile ? "fill-[#1E7F57]/10" : ""} />
        <span className="text-[10px] font-bold">Profile</span>
      </Link>

    </div>
  );
}