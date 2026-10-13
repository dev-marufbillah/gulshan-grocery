"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Download, ShoppingBag } from "lucide-react";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  emoji: string;
  weight: string;
  qty: number;
};

type OrderSnapshot = {
  orderId: string;
  paymentMethod: string;
  transactionId: string;
  deliveryDate: string;
  items: OrderItem[];
  subTotal: number;
  shipping: number;
  taxes: number;
  discount: number;
  total: number;
};

function readOrder(): OrderSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("gulshan-last-order");
    if (!raw) return null;
    return JSON.parse(raw) as OrderSnapshot;
  } catch {
    return null;
  }
}

export default function OrderCompletedClient() {
  // lazy init — একবারই পড়ে, infinite loop / setState-in-effect error নেই
  const [order] = useState<OrderSnapshot | null>(() => readOrder());

  if (!order) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#F4F4F4]">
          <ShoppingBag size={40} className="text-[#6b6b6b]" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-[#1a1a1a]">
          No order found
        </h2>
        <p className="mt-2 text-[#6b6b6b]">
          Please complete a checkout first.
        </p>
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
    <section className="mx-auto max-w-4xl px-4 py-14 md:px-6">
      {/* Success Icon */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FBC617] text-white shadow-lg">
          <Check size={40} strokeWidth={3} />
        </div>
        <h2 className="mt-6 text-3xl font-bold text-[#1a1a1a]">
          Your order is completed!
        </h2>
        <p className="mt-2 text-[#6b6b6b]">
          Thank you. Your Order has been received.
        </p>
      </div>

      {/* Yellow Info Bar */}
      <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-[#FBC617] p-5 md:flex-row md:items-center md:justify-between md:gap-0 md:p-0 md:py-3 md:pl-6 md:pr-3">
        <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4 md:gap-0">
          <div className="md:border-r md:border-black/10 md:px-4 md:py-2">
            <p className="text-xs font-medium text-[#1a1a1a]/70">Order ID</p>
            <p className="mt-1 font-bold text-[#1a1a1a]">{order.orderId}</p>
          </div>
          <div className="md:border-r md:border-black/10 md:px-4 md:py-2">
            <p className="text-xs font-medium text-[#1a1a1a]/70">
              Payment Method
            </p>
            <p className="mt-1 font-bold text-[#1a1a1a]">
              {order.paymentMethod}
            </p>
          </div>
          <div className="md:border-r md:border-black/10 md:px-4 md:py-2">
            <p className="text-xs font-medium text-[#1a1a1a]/70">
              Transaction ID
            </p>
            <p className="mt-1 font-bold text-[#1a1a1a]">
              {order.transactionId}
            </p>
          </div>
          <div className="md:px-4 md:py-2">
            <p className="text-xs font-medium text-[#1a1a1a]/70">
              Estimated Delivery Date
            </p>
            <p className="mt-1 font-bold text-[#1a1a1a]">
              {order.deliveryDate}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#1E7F57] px-6 text-sm font-semibold text-white transition hover:bg-[#166b48] md:ml-4"
        >
          <Download size={16} />
          Download Invoice
        </button>
      </div>

      {/* Order Details Card */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-[#e5e5e5]">
        <div className="border-b border-[#e5e5e5] px-6 py-4">
          <h3 className="text-lg font-bold text-[#1a1a1a]">Order Details</h3>
        </div>

        <div className="hidden grid-cols-[1fr_120px] gap-4 border-b border-[#e5e5e5] px-6 py-3 text-sm font-semibold text-[#6b6b6b] sm:grid">
          <span>Products</span>
          <span className="text-right">Sub Total</span>
        </div>

        <div className="divide-y divide-[#e5e5e5]">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 items-center gap-3 px-6 py-4 sm:grid-cols-[1fr_120px]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#e5e5e5] bg-[#F9F9F9] text-3xl">
                  {item.emoji}
                </div>
                <div>
                  <p className="font-semibold text-[#1a1a1a]">
                    {item.name}
                    {item.qty > 1 ? ` x ${item.qty}` : ""}
                  </p>
                  <p className="text-sm text-[#6b6b6b]">{item.weight}</p>
                </div>
              </div>
              <p className="text-right font-semibold text-[#1a1a1a]">
                ৳{(item.price * item.qty).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t border-[#e5e5e5] bg-[#F9F9F9] px-6 py-5 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6b6b6b]">Shipping</span>
            <span className="font-semibold text-[#1a1a1a]">
              {order.shipping === 0
                ? "৳0.00"
                : `৳${order.shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6b6b6b]">Taxes</span>
            <span className="font-semibold text-[#1a1a1a]">
              ৳{order.taxes.toFixed(2)}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Coupon Discount</span>
              <span className="font-semibold">
                -৳{order.discount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t border-[#e5e5e5] pt-3 text-base">
            <span className="font-bold text-[#1a1a1a]">Total</span>
            <span className="font-bold text-[#1E7F57]">
              ৳{order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/shop"
          className="rounded-full bg-[#1E7F57] px-8 py-3 font-semibold text-white transition hover:bg-[#166b48]"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="rounded-full border border-[#e5e5e5] px-8 py-3 font-semibold text-[#1a1a1a] transition hover:border-[#1E7F57] hover:text-[#1E7F57]"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}