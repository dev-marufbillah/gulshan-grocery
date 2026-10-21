"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Download, ShoppingBag, AlertCircle, X } from "lucide-react";
import toast from "react-hot-toast";

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
  status?: string;
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
  const [order] = useState<OrderSnapshot | null>(() => readOrder());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string>(
    order?.status || "Accepted"
  );

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

  const handleCancelRequest = async () => {
    if (!reason.trim()) {
      toast.error("Please enter a reason for cancellation");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.orderId, reason }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Cancellation request sent to Admin successfully!");
        setOrderStatus("Cancel Requested");
        setIsModalOpen(false);
      } else {
        toast.error(data.error || "Failed to submit cancellation request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 md:px-6">
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

      {orderStatus === "Cancel Requested" && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertCircle className="shrink-0 text-amber-600" size={20} />
          <div>
            <p className="font-bold">Cancellation Pending Approval</p>
            <p className="text-xs text-amber-700">
              Your cancellation request has been sent to our admin. We will review it and contact you shortly.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-[#FBC617] p-5 md:flex-row md:items-center md:justify-between md:gap-0 md:p-0 md:py-3 md:pl-6 md:pr-3">
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

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#e5e5e5]">
        <div className="flex items-center justify-between border-b border-[#e5e5e5] px-6 py-4">
          <h3 className="text-lg font-bold text-[#1a1a1a]">Order Details</h3>
          
          {orderStatus !== "Cancelled" && orderStatus !== "Cancel Requested" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-semibold text-red-600 hover:underline"
            >
              Cancel Order
            </button>
          )}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-[#1a1a1a]">
                Cancel Order Request
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Please tell us why you want to cancel this order. Our admin team will review your request and get back to you.
            </p>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for cancellation (e.g., Change of mind, ordered wrong item, address issue...)"
              className="mt-4 h-28 w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-800 focus:border-[#1E7F57] focus:outline-none focus:ring-1 focus:ring-[#1E7F57]"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
                className="rounded-full bg-gray-100 px-5 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={handleCancelRequest}
                disabled={loading}
                className="rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Cancellation Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}