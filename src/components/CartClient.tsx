"use client";

import { useSyncExternalStore, useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, X, ArrowLeft } from "lucide-react";
import { useCartStore, CartItem } from "@/store/cart";

type ExtendedCartItem = CartItem & {
  id?: string;
  qty?: number;
  weight?: string;
};

const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function CartClient() {
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const [couponCode, setCouponCode] = useState("");

  const getItemId = (item: ExtendedCartItem): string => {
    return String(item._id || item.id || "");
  };

  const getItemQty = (item: ExtendedCartItem): number => {
    return Number(item.quantity ?? item.qty) || 1;
  };

  const getItemPrice = (item: ExtendedCartItem): number => {
    return Number(item.price) || 0;
  };

  const subtotal = items.reduce((acc, rawItem) => {
    const item = rawItem as ExtendedCartItem;
    return acc + getItemPrice(item) * getItemQty(item);
  }, 0);

  const handleQuantityChange = (item: ExtendedCartItem, delta: number) => {
    const id = getItemId(item);
    if (id) {
      updateQuantity(id, delta);
    }
  };

  const handleRemove = (item: ExtendedCartItem) => {
    const id = getItemId(item);
    if (id) {
      removeItem(id);
    }
  };

  if (!hydrated) {
    return (
      <div className="mx-auto flex min-h-64 max-w-7xl items-center justify-center p-6 text-sm font-semibold text-[#6b6b6b]">
        Loading cart items...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F3EE] text-[#1E7F57]">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Your cart is empty</h2>
        <p className="mt-2 text-sm text-[#6b6b6b]">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1E7F57] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#166b48] active:scale-95"
        >
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((rawItem, index) => {
            const item = rawItem as ExtendedCartItem;
            const id = getItemId(item);
            const price = getItemPrice(item);
            const qty = getItemQty(item);
            const itemSubtotal = price * qty;
            const unitName = item.unit || item.weight || "1 pc";

            return (
              <div
                key={id || index}
                className="relative rounded-2xl border border-[#ececec] bg-white p-4 sm:p-5 shadow-xs transition hover:border-[#1E7F57]"
              >
                {/* Cross (X) Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[#8c8c8c] hover:bg-gray-100 hover:text-red-500 transition cursor-pointer"
                  aria-label="Remove item"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#F9F9F9] p-2 border border-[#ececec]">
                    {item.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-3xl">🛒</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 pr-6">
                    <h3 className="text-base font-bold text-[#1a1a1a]">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#8c8c8c] mt-0.5">{unitName}</p>

                    <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-lg font-bold text-[#1a1a1a]">
                        ৳{price}
                      </span>

                      {/* Stepper (- QTY +) */}
                      <div className="flex items-center rounded-xl border border-[#ececec] bg-white px-2 py-1 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#1a1a1a] hover:bg-gray-100 active:scale-90 transition font-bold cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[#1a1a1a]">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#1a1a1a] hover:bg-gray-100 active:scale-90 transition font-bold cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="mt-4 flex items-center justify-between border-t border-[#f0f0f0] pt-3 text-xs sm:text-sm">
                  <span className="text-[#6b6b6b] font-medium">Subtotal:</span>
                  <span className="font-bold text-[#1a1a1a] text-sm sm:text-base">
                    ৳{itemSubtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={clearCart}
              className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:underline cursor-pointer"
            >
              <Trash2 size={14} /> Clear Cart
            </button>
            <Link
              href="/shop"
              className="text-xs font-bold text-[#1E7F57] hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Totals */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#ececec] bg-white p-5 sm:p-6 shadow-xs">
            <h3 className="border-b border-[#ececec] pb-3 text-lg font-bold text-[#1a1a1a]">
              Cart Totals
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-[#6b6b6b]">
                <span>Subtotal</span>
                <span className="font-bold text-[#1a1a1a]">৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#6b6b6b]">
                <span>Shipping</span>
                <span className="font-medium text-[#1E7F57]">Free</span>
              </div>
              <div className="border-t border-[#ececec] pt-3 flex justify-between text-base font-bold text-[#1a1a1a]">
                <span>Total</span>
                <span className="text-xl text-[#1E7F57]">৳{subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Code Box */}
            <div className="mt-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon Code"
                  className="w-full rounded-xl border border-[#ececec] px-3 py-2.5 text-xs text-[#1a1a1a] focus:border-[#1E7F57] focus:outline-none"
                />
                <button
                  type="button"
                  className="shrink-0 rounded-xl bg-[#1E7F57] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#166b48] cursor-pointer"
                >
                  Apply Coupon
                </button>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-xl bg-[#1E7F57] py-3.5 text-center text-sm font-bold text-white shadow-md transition hover:bg-[#166b48] active:scale-95"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}