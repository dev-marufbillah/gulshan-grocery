"use client";

import { useState } from "react";
import {
  ClipboardList,
  BadgeCheck,
  Package,
  Truck,
  Home,
  Check,
  MapPin,
} from "lucide-react";

type OrderProduct = {
  name: string;
  weight: string;
  qty: number;
  emoji: string;
};

type RealOrderData = {
  orderId: string;
  email: string;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderProduct[];
};

const STEP_ICONS = [ClipboardList, BadgeCheck, Package, Truck, Home];

export default function TrackOrderClient() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<RealOrderData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const formattedOrderId = orderId.trim().toUpperCase().startsWith("#")
      ? orderId.trim().toUpperCase()
      : `#${orderId.trim().toUpperCase()}`;

    if (!formattedOrderId || !email.trim()) {
      setError("Please fill in both Order ID and Billing Email.");
      return;
    }

    setLoading(true);
    
    try {
      // 🌟 Real API Call
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: formattedOrderId, email }),
      });

      const data = await res.json();

      if (res.ok && data.order) {
        setResult(data.order);
      } else {
        setError(data.error || "Order not found. Please check your details.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ===================== DETAILS VIEW =====================
  if (result) {
    // 🌟 Database Status কে Timeline Index এ কনভার্ট করা
    const getStepIndex = (status: string) => {
      switch (status) {
        case "Processing": return 0; // Order Placed
        case "Accepted": return 1;   // Accepted
        case "On the Way": return 3; // On the way
        case "Delivered": return 4;  // Delivered
        default: return 1;
      }
    };

    const currentStep = getStepIndex(result.status);
    const progressPercentage = (currentStep / 4) * 80; // 4 is total segments

    const orderDate = new Date(result.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const steps = [
      { label: "Order Placed", date: orderDate },
      { label: "Accepted", date: currentStep >= 1 ? orderDate : "Expected" },
      { label: "In Progress", date: currentStep >= 2 ? orderDate : "Expected" },
      { label: "On the Way", date: currentStep >= 3 ? "Updated" : "Expected" },
      { label: "Delivered", date: currentStep >= 4 ? "Done" : "Expected" },
    ];

    if (result.status === "Cancelled") {
      return (
        <section className="mx-auto max-w-3xl px-4 py-14 text-center md:px-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
            <ClipboardList size={32} />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-[#1a1a1a]">Order Cancelled</h2>
          <p className="mt-2 text-[#6b6b6b]">Your order {result.orderId} has been cancelled.</p>
          <button
            onClick={() => setResult(null)}
            className="mt-8 rounded-full bg-[#1E7F57] px-8 py-3 font-semibold text-white hover:bg-[#166b48]"
          >
            Track Another Order
          </button>
        </section>
      );
    }

    return (
      <section className="mx-auto max-w-5xl px-4 py-14 md:px-6">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Order Status</h2>
          <p className="mt-1 text-sm text-[#6b6b6b]">
            Order ID :{" "}
            <span className="font-semibold text-[#1a1a1a]">{result.orderId}</span>
          </p>
        </div>

        {/* Yellow info bar */}
        <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl bg-[#FBC617] px-6 py-5 sm:grid-cols-3 sm:gap-0">
          <div className="sm:border-r sm:border-black/10 sm:pr-4">
            <p className="text-xs font-medium text-[#1a1a1a]/70">Order ID</p>
            <p className="mt-1 font-bold text-[#1a1a1a]">{result.orderId}</p>
          </div>
          <div className="sm:border-r sm:border-black/10 sm:px-4">
            <p className="text-xs font-medium text-[#1a1a1a]/70">Payment Method</p>
            <p className="mt-1 font-bold text-[#1a1a1a]">{result.paymentMethod}</p>
          </div>
          <div className="sm:pl-4">
            <p className="text-xs font-medium text-[#1a1a1a]/70">Total Amount</p>
            <p className="mt-1 font-bold text-[#1a1a1a]">৳{result.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Horizontal timeline */}
        <div className="rounded-2xl border border-[#e5e5e5] bg-white px-3 py-10 md:px-8">
          <div className="relative mx-auto max-w-4xl overflow-x-auto pb-4 md:overflow-visible md:pb-0">
            <div className="min-w-[600px] md:min-w-0 relative">
              <div className="absolute left-[10%] right-[10%] top-[94px] h-[4px] bg-[#E5E5E5]" />
              <div
                className="absolute left-[10%] top-[94px] h-[4px] bg-[#1E7F57] transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />

              <div className="grid grid-cols-5">
                {steps.map((step, i) => {
                  const done = i <= currentStep;
                  const Icon = STEP_ICONS[i];

                  return (
                    <div key={step.label} className="flex flex-col items-center text-center">
                      <div className="flex h-10 items-center justify-center">
                        <Icon size={28} strokeWidth={1.6} className={done ? "text-[#FBC617]" : "text-[#B0B0B0]"} />
                      </div>
                      <div className="flex h-10 items-center justify-center">
                        <p className={`text-sm font-semibold ${done ? "text-[#1a1a1a]" : "text-[#A0A0A0]"}`}>
                          {step.label}
                        </p>
                      </div>
                      <div className="relative z-10 my-1 flex h-7 items-center justify-center">
                        {done ? (
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1E7F57] text-white shadow-sm">
                            <Check size={16} strokeWidth={3} />
                          </span>
                        ) : (
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EFEFEF] text-[#C5C5C5]">
                            <Check size={16} strokeWidth={2.5} />
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-[#6b6b6b]">
                        <p className={done ? "font-bold text-[#1a1a1a]" : "font-medium"}>{step.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-[#6b6b6b]">
          <MapPin size={14} className="text-[#1E7F57]" />
          Live Tracking for <span className="font-medium text-[#1a1a1a]">{result.email}</span>
        </p>

        {/* Products */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
          <div className="border-b border-[#e5e5e5] px-6 py-4">
            <h3 className="text-base font-bold text-[#1a1a1a]">Ordered Products</h3>
          </div>
          <div className="divide-y divide-[#e5e5e5]">
            {result.items.map((p, idx) => (
              <div key={idx} className="flex items-center gap-4 px-6 py-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#e5e5e5] bg-[#F9F9F9] text-3xl">
                  {p.emoji}
                </div>
                <div>
                  <p className="font-semibold text-[#1a1a1a]">{p.name}</p>
                  <p className="text-sm text-[#6b6b6b]">{p.weight} | {p.qty} Qty.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setOrderId("");
              setEmail("");
              setError("");
            }}
            className="text-sm font-semibold text-[#1E7F57] underline underline-offset-4 hover:text-[#166b48]"
          >
            Track another order
          </button>
        </div>
      </section>
    );
  }

  // ===================== FORM VIEW =====================
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 md:px-6">
      <p className="text-sm leading-relaxed text-[#6b6b6b]">
        To track your order please enter your Order ID in the box below and
        press the &quot;Track Order&quot; button.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
            Order ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Ex: #SDGTXXXXXX"
            className="w-full rounded-full border border-[#e5e5e5] px-5 py-3.5 text-sm outline-none transition focus:border-[#1E7F57]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
            Billing Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email Address"
            className="w-full rounded-full border border-[#e5e5e5] px-5 py-3.5 text-sm outline-none transition focus:border-[#1E7F57]"
          />
        </div>

        {error && <p className="text-sm font-medium text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#1E7F57] px-10 py-3.5 text-sm font-semibold text-white transition hover:bg-[#166b48] disabled:opacity-70"
        >
          {loading ? "Searching Database..." : "Track Real Order"}
        </button>
      </form>
    </section>
  );
}