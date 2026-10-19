"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tag, ShoppingBag, User, Store } from "lucide-react";
import { useCartStore } from "@/store/cart";

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

  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur-md lg:hidden shadow-lg">
      <div className="relative flex h-16 items-center justify-around px-2">
        {/* 1. HOME */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 w-14 transition ${
            pathname === "/"
              ? "text-[#1E7F57] font-bold"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Home size={20} />
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        {/* 2. OFFERS */}
        <Link
          href="/offers"
          className={`relative flex flex-col items-center justify-center gap-1 w-14 transition ${
            pathname === "/offers"
              ? "text-[#1E7F57] font-bold"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <div className="relative">
            <Tag size={20} className="rotate-90" />
            <span className="absolute -top-1.5 -right-2.5 rounded-full bg-red-500 px-1 py-0.2 text-[8px] font-extrabold text-white animate-pulse">
              HOT
            </span>
          </div>
          <span className="text-[10px] tracking-tight">Offers</span>
        </Link>

        {/* 3. CENTER FLOATING CART BUTTON */}
        <div className="relative -top-5 flex items-center justify-center">
          <Link
            href="/cart"
            aria-label="Shopping Cart"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1E7F57] text-white shadow-lg ring-4 ring-white transition-transform active:scale-90 hover:bg-[#166b48]"
          >
            <ShoppingBag size={24} />

            {/* Real Cart Count Badge */}
            {hydrated && cartCount > 0 && (
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#FBC617] text-[11px] font-bold text-[#1a1a1a] ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* 4. SHOP */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center gap-1 w-14 transition ${
            pathname?.startsWith("/shop")
              ? "text-[#1E7F57] font-bold"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Store size={20} />
          <span className="text-[10px] tracking-tight">Shop</span>
        </Link>

        {/* 5. PROFILE */}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center gap-1 w-14 transition ${
            pathname?.includes("profile") || pathname?.includes("account")
              ? "text-[#1E7F57] font-bold"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <User size={20} />
          <span className="text-[10px] tracking-tight">Profile</span>
        </Link>
      </div>
    </nav>
  );
}