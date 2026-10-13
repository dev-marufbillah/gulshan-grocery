"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function CartClient() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalItems = useCartStore((s) => s.totalItems());
  const totalPrice = useCartStore((s) => s.totalPrice());

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const subTotal = totalPrice;
  const shipping = items.length > 0 && subTotal < 500 ? 60 : 0;
  const taxes = 0; 
  const total = subTotal + shipping + taxes - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "discount25") {
      setDiscount(50);
      alert("Coupon applied successfully!");
    } else {
      alert("Invalid Coupon Code");
      setDiscount(0);
    }
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20 text-center md:px-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#F4F4F4]">
          <ShoppingBag size={40} className="text-[#6b6b6b]" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-[#1a1a1a]">Your cart is empty</h2>
        <p className="mt-2 text-[#6b6b6b]">Looks like you haven&apos;t added anything yet.</p>
        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-full bg-[#1E7F57] px-8 py-3 font-semibold text-white transition hover:bg-[#166b48]"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        
        <div>
          <div className="hidden grid-cols-[40px_2.5fr_1fr_120px_1fr] gap-4 rounded-t-xl bg-[#FBC617] px-6 py-4 text-sm font-bold text-[#1a1a1a] md:grid">
            <span /> 
            <span>Product</span>
            <span>Price</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Subtotal</span>
          </div>

          <div className="border border-t-0 border-[#e5e5e5] rounded-b-xl max-md:border-t max-md:rounded-xl">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 items-center gap-4 border-b border-[#e5e5e5] p-4 last:border-b-0 md:grid-cols-[40px_2.5fr_1fr_120px_1fr] md:p-6"
              >
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="hidden h-6 w-6 items-center justify-center text-[#6b6b6b] hover:text-red-500 md:flex"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-4 relative">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="absolute right-0 top-0 p-1 text-[#6b6b6b] hover:text-red-500 md:hidden"
                  >
                    <X size={18} />
                  </button>

                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#F9F9F9] text-4xl border border-[#e5e5e5]">
                    {item.emoji}
                  </div>
                  <div>
                    <Link href={`/shop/${item.slug || item.id}`} className="font-bold text-[#1a1a1a] hover:text-[#1E7F57] transition">
                      {item.name}
                    </Link>
                    <p className="text-sm text-[#6b6b6b]">{item.weight}</p>
                  </div>
                </div>

                <p className="font-bold text-[#1a1a1a] max-md:hidden">৳{item.price}</p>

                <div className="flex items-center justify-between max-md:mt-2">
                  <span className="md:hidden font-bold text-[#1a1a1a]">৳{item.price}</span>
                  
                  {/* w-[100px] কে w-25 করা হয়েছে */}
                  <div className="flex h-10 w-25 items-center justify-between rounded border border-[#e5e5e5] px-2 bg-white mx-auto">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="flex h-6 w-6 items-center justify-center text-[#1a1a1a] hover:bg-gray-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-semibold">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="flex h-6 w-6 items-center justify-center text-[#1a1a1a] hover:bg-gray-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="text-right font-bold text-[#1a1a1a] max-md:mt-2 max-md:flex max-md:justify-between max-md:border-t max-md:pt-2">
                  <span className="md:hidden text-[#6b6b6b] font-normal">Subtotal:</span>
                  ৳{(item.price * item.qty).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            {/* max-w-[400px] কে max-w-100 করা হয়েছে */}
            <div className="flex w-full max-w-100 items-center gap-4">
              <input
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="h-12 flex-1 rounded-full border border-[#e5e5e5] px-5 text-sm outline-none focus:border-[#1E7F57]"
              />
              <button
                onClick={handleApplyCoupon}
                className="h-12 whitespace-nowrap rounded-full bg-[#1E7F57] px-6 text-sm font-semibold text-white transition hover:bg-[#166b48]"
              >
                Apply Coupon
              </button>
            </div>

            <button
              onClick={clearCart}
              className="text-sm font-semibold text-[#1E7F57] underline underline-offset-4 hover:text-red-500"
            >
              Clear Shopping Cart
            </button>
          </div>
        </div>

        <div>
          <div className="rounded-2xl border border-[#e5e5e5] p-6 shadow-sm">
            <h3 className="text-xl font-bold text-[#1a1a1a] border-b border-[#e5e5e5] pb-4">
              Order Summary
            </h3>

            <div className="mt-6 space-y-4 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-[#6b6b6b]">Items</span>
                <span className="text-[#1a1a1a] font-bold">{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b6b]">Sub Total</span>
                <span className="text-[#1a1a1a] font-bold">৳{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b6b]">Shipping</span>
                <span className="text-[#1a1a1a] font-bold">
                  {shipping === 0 ? "Free" : `৳${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b6b]">Taxes</span>
                <span className="text-[#1a1a1a] font-bold">৳{taxes.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span className="font-bold">-৳{discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t border-[#e5e5e5] pt-4 flex justify-between text-lg">
                <span className="font-bold text-[#1a1a1a]">Total</span>
                <span className="font-bold text-[#1E7F57]">৳{total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-[#1E7F57] font-semibold text-white transition hover:bg-[#166b48]"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}