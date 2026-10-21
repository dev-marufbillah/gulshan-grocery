"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

  // ─── Scroll Hide / Show Logic ───
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const diff = currentScrollY - lastScrollY.current;

        // ১০px এর বেশি scroll হলেই direction detect করবে (jitter এড়ানোর জন্য)
        if (Math.abs(diff) > 10) {
          if (diff > 0 && currentScrollY > 80) {
            // ⬇️ নিচে scroll → hide
            setIsVisible(false);
          } else if (diff < 0) {
            // ⬆️ উপরে scroll → show
            setIsVisible(true);
          }
          lastScrollY.current = currentScrollY;
        }

        // একদম উপরে থাকলে সবসময় visible
        if (currentScrollY <= 10) {
          setIsVisible(true);
        }

        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur-md lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="relative flex h-16 items-center justify-around px-2">
        {/* 1. HOME */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors duration-200 ${
            pathname === "/"
              ? "text-[#1E7F57]"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <div className="relative">
            <Home
              size={21}
              strokeWidth={pathname === "/" ? 2.5 : 1.8}
            />
            {pathname === "/" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#1E7F57]" />
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight ${
              pathname === "/" ? "font-bold" : "font-medium"
            }`}
          >
            Home
          </span>
        </Link>

        {/* 2. OFFERS */}
        <Link
          href="/offers"
          className={`relative flex flex-col items-center justify-center gap-1 w-14 transition-colors duration-200 ${
            pathname === "/offers"
              ? "text-[#1E7F57]"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <div className="relative">
            <Tag
              size={21}
              className="rotate-90"
              strokeWidth={pathname === "/offers" ? 2.5 : 1.8}
            />
            <span className="absolute -top-1.5 -right-3 rounded-full bg-red-500 px-1 py-px text-[7px] font-extrabold text-white leading-tight animate-pulse">
              HOT
            </span>
          </div>
          <span
            className={`text-[10px] tracking-tight ${
              pathname === "/offers" ? "font-bold" : "font-medium"
            }`}
          >
            Offers
          </span>
        </Link>

        {/* 3. CENTER FLOATING CART BUTTON */}
        <div className="relative -top-5 flex items-center justify-center">
          <Link
            href="/cart"
            aria-label="Shopping Cart"
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1E7F57] text-white shadow-lg shadow-[#1E7F57]/30 ring-4 ring-white transition-all active:scale-90 hover:bg-[#166b48] hover:shadow-xl hover:shadow-[#1E7F57]/40"
          >
            <ShoppingBag size={24} />

            {/* Real Cart Count Badge */}
            {hydrated && cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FBC617] px-1 text-[10px] font-black text-[#1a1a1a] ring-2 ring-white animate-bounce-in">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* 4. SHOP */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors duration-200 ${
            pathname?.startsWith("/shop")
              ? "text-[#1E7F57]"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <div className="relative">
            <Store
              size={21}
              strokeWidth={pathname?.startsWith("/shop") ? 2.5 : 1.8}
            />
            {pathname?.startsWith("/shop") && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#1E7F57]" />
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight ${
              pathname?.startsWith("/shop") ? "font-bold" : "font-medium"
            }`}
          >
            Shop
          </span>
        </Link>

        {/* 5. PROFILE */}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors duration-200 ${
            pathname?.includes("profile") || pathname?.includes("account")
              ? "text-[#1E7F57]"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <div className="relative">
            <User
              size={21}
              strokeWidth={
                pathname?.includes("profile") ||
                pathname?.includes("account")
                  ? 2.5
                  : 1.8
              }
            />
            {(pathname?.includes("profile") ||
              pathname?.includes("account")) && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#1E7F57]" />
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight ${
              pathname?.includes("profile") ||
              pathname?.includes("account")
                ? "font-bold"
                : "font-medium"
            }`}
          >
            Profile
          </span>
        </Link>
      </div>
    </nav>
  );
}