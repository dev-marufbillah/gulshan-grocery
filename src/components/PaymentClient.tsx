"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Building2, Smartphone } from "lucide-react";
import { useCartStore } from "@/store/cart";

const METHOD_LABELS: Record<string, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  bank: "Bank Pay",
};

type PaymentSettings = {
  bkashNumber: string;
  nagadNumber: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
};

function makeOrderId() {
  return (
    "#SDGT" +
    Math.random().toString(36).slice(2, 6).toUpperCase() +
    Math.floor(Math.random() * 900 + 100)
  );
}

function makeTxnId() {
  return (
    "TR" +
    Math.random().toString(36).slice(2, 6).toUpperCase() +
    Math.random().toString(36).slice(2, 5).toUpperCase()
  );
}

function deliveryDateLabel() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function PaymentClient() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.totalItems());
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);

  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [loading, setLoading] = useState(false);
  const [trxId, setTrxId] = useState("");
  const [settings, setSettings] = useState<PaymentSettings>({
    bkashNumber: "",
    nagadNumber: "",
    bankName: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankBranch: "",
  });

  useEffect(() => {
    fetch("/api/admin/section-settings")
      .then((r) => r.json())
      .then((data) => {
        const p = data?.payment || data || {};
        setSettings({
          bkashNumber: p.bkashNumber || "",
          nagadNumber: p.nagadNumber || "",
          bankName: p.bankName || "",
          bankAccountName: p.bankAccountName || "",
          bankAccountNumber: p.bankAccountNumber || "",
          bankBranch: p.bankBranch || "",
        });
      })
      .catch(() => {
        // keep empty fallbacks
      });
  }, []);

  const subTotal = totalPrice;
  const shipping = items.length > 0 && subTotal < 500 ? 60 : 0;
  const taxes = 0;
  const discount = 0;
  const total = subTotal + shipping + taxes - discount;

  const handleConfirmPayment = async () => {
    if (!trxId.trim()) {
      alert("Please enter your Transaction ID / Reference.");
      return;
    }

    setLoading(true);

    const orderId = makeOrderId();
    const txnId = trxId.trim() || makeTxnId();
    const deliveryDate = deliveryDateLabel();
    const chosenMethod = METHOD_LABELS[paymentMethod] || paymentMethod;

    const snapshot = {
      orderId,
      paymentMethod: chosenMethod,
      transactionId: txnId,
      deliveryDate,
      items: items.map((i) => ({ ...i })),
      subTotal,
      shipping,
      taxes,
      discount,
      total,
    };

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          customerName: "Gulshan Customer",
          email: "customer@example.com",
          phone: "+880 1700-000000",
          address: "Gulshan 1, Dhaka 1212",
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            qty: i.qty,
            emoji: i.emoji,
            weight: i.weight,
          })),
          totalAmount: total,
          paymentMethod: chosenMethod,
          transactionId: txnId,
        }),
      });

      sessionStorage.setItem("gulshan-last-order", JSON.stringify(snapshot));
      clearCart();
      router.push("/order-completed");
    } catch {
      alert("Failed to connect to server. Redirecting anyway...");
      sessionStorage.setItem("gulshan-last-order", JSON.stringify(snapshot));
      clearCart();
      router.push("/order-completed");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20 text-center md:px-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#F4F4F4]">
          <ShoppingBag size={40} className="text-[#6b6b6b]" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-[#1a1a1a]">
          No items to checkout
        </h2>
        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-full bg-[#1E7F57] px-8 py-3 font-semibold text-white transition hover:bg-[#166b48]"
        >
          Return to Shop
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Left: Payment Methods */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-[#1a1a1a]">
            Select Payment Method
          </h2>

          <div className="space-y-4">
            {/* bKash */}
            <div
              className={`overflow-hidden rounded-xl border transition ${
                paymentMethod === "bkash"
                  ? "border-[#1E7F57] bg-[#F4F9F7]"
                  : "border-[#e5e5e5]"
              }`}
            >
              <label className="flex cursor-pointer items-center gap-4 px-6 py-5 transition hover:bg-[#F4F9F7]">
                <input
                  type="radio"
                  name="payment"
                  value="bkash"
                  checked={paymentMethod === "bkash"}
                  onChange={() => {
                    setPaymentMethod("bkash");
                    setTrxId("");
                  }}
                  className="h-5 w-5 cursor-pointer accent-[#1E7F57]"
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E2136E] text-sm font-bold text-white">
                  bK
                </div>
                <span className="font-semibold text-[#1a1a1a]">bKash</span>
              </label>

              {paymentMethod === "bkash" && (
                <div className="border-t border-[#1E7F57]/20 px-6 pb-6 pt-5">
                  <p className="text-sm text-[#6b6b6b]">
                    Send{" "}
                    <span className="font-bold text-[#1a1a1a]">
                      ৳{total.toFixed(2)}
                    </span>{" "}
                    to bKash Personal:
                  </p>
                  <p className="mt-2 text-lg font-bold text-[#E2136E]">
                    {settings.bkashNumber || "Not set in Admin"}
                  </p>
                  <p className="mt-1 text-xs text-[#6b6b6b]">
                    After payment, enter your bKash Transaction ID below.
                  </p>
                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                      bKash TrxID *
                    </label>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. 8N7A2BX5K1"
                      className="w-full rounded-full border border-[#e5e5e5] bg-white px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Nagad */}
            <div
              className={`overflow-hidden rounded-xl border transition ${
                paymentMethod === "nagad"
                  ? "border-[#1E7F57] bg-[#F4F9F7]"
                  : "border-[#e5e5e5]"
              }`}
            >
              <label className="flex cursor-pointer items-center gap-4 px-6 py-5 transition hover:bg-[#F4F9F7]">
                <input
                  type="radio"
                  name="payment"
                  value="nagad"
                  checked={paymentMethod === "nagad"}
                  onChange={() => {
                    setPaymentMethod("nagad");
                    setTrxId("");
                  }}
                  className="h-5 w-5 cursor-pointer accent-[#1E7F57]"
                />
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F15A29] text-sm font-bold text-white">
                  N
                </div>
                <span className="font-semibold text-[#1a1a1a]">Nagad</span>
              </label>

              {paymentMethod === "nagad" && (
                <div className="border-t border-[#1E7F57]/20 px-6 pb-6 pt-5">
                  <p className="text-sm text-[#6b6b6b]">
                    Send{" "}
                    <span className="font-bold text-[#1a1a1a]">
                      ৳{total.toFixed(2)}
                    </span>{" "}
                    to Nagad Personal:
                  </p>
                  <p className="mt-2 text-lg font-bold text-[#F15A29]">
                    {settings.nagadNumber || "Not set in Admin"}
                  </p>
                  <p className="mt-1 text-xs text-[#6b6b6b]">
                    After payment, enter your Nagad Transaction ID below.
                  </p>
                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                      Nagad TrxID *
                    </label>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. 7A1B9C2D3E"
                      className="w-full rounded-full border border-[#e5e5e5] bg-white px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bank Pay */}
            <div
              className={`overflow-hidden rounded-xl border transition ${
                paymentMethod === "bank"
                  ? "border-[#1E7F57] bg-[#F4F9F7]"
                  : "border-[#e5e5e5]"
              }`}
            >
              <label className="flex cursor-pointer items-center gap-4 px-6 py-5 transition hover:bg-[#F4F9F7]">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={() => {
                    setPaymentMethod("bank");
                    setTrxId("");
                  }}
                  className="h-5 w-5 cursor-pointer accent-[#1E7F57]"
                />
                <Building2 className="text-[#1E7F57]" size={24} />
                <span className="font-semibold text-[#1a1a1a]">Bank Pay</span>
              </label>

              {paymentMethod === "bank" && (
                <div className="border-t border-[#1E7F57]/20 px-6 pb-6 pt-5">
                  <p className="mb-3 text-sm text-[#6b6b6b]">
                    Transfer{" "}
                    <span className="font-bold text-[#1a1a1a]">
                      ৳{total.toFixed(2)}
                    </span>{" "}
                    to the bank account below:
                  </p>
                  <div className="space-y-2 rounded-xl bg-white p-4 text-sm border border-[#e5e5e5]">
                    <div className="flex justify-between gap-3">
                      <span className="text-[#6b6b6b]">Bank Name</span>
                      <span className="font-semibold text-[#1a1a1a] text-right">
                        {settings.bankName || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-[#6b6b6b]">Account Name</span>
                      <span className="font-semibold text-[#1a1a1a] text-right">
                        {settings.bankAccountName || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-[#6b6b6b]">Account Number</span>
                      <span className="font-semibold text-[#1E7F57] text-right">
                        {settings.bankAccountNumber || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-[#6b6b6b]">Branch</span>
                      <span className="font-semibold text-[#1a1a1a] text-right">
                        {settings.bankBranch || "—"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                      Bank Reference / TrxID *
                    </label>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="Enter transfer reference"
                      className="w-full rounded-full border border-[#e5e5e5] bg-white px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs text-[#6b6b6b]">
            <Smartphone size={14} className="mt-0.5 shrink-0 text-[#1E7F57]" />
            Only bKash, Nagad and Bank Pay are accepted. Cash on Delivery is not
            available.
          </p>
        </div>

        {/* Right: Summary */}
        <div>
          <div className="sticky top-20 rounded-2xl border border-[#e5e5e5] p-6 shadow-sm">
            <h3 className="border-b border-[#e5e5e5] pb-4 text-xl font-bold text-[#1a1a1a]">
              Order Summary
            </h3>

            <div className="mt-6 space-y-4 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-[#6b6b6b]">Items</span>
                <span className="font-bold text-[#1a1a1a]">{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b6b]">Sub Total</span>
                <span className="font-bold text-[#1a1a1a]">
                  ৳{subTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b6b]">Shipping</span>
                <span className="font-bold text-[#1a1a1a]">
                  {shipping === 0 ? "Free" : `৳${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b6b]">Taxes</span>
                <span className="font-bold text-[#1a1a1a]">
                  ৳{taxes.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b6b]">Method</span>
                <span className="font-bold text-[#1a1a1a]">
                  {METHOD_LABELS[paymentMethod]}
                </span>
              </div>

              <div className="flex justify-between border-t border-[#e5e5e5] pt-4 text-lg">
                <span className="font-bold text-[#1a1a1a]">Total</span>
                <span className="font-bold text-[#1E7F57]">
                  ৳{total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleConfirmPayment}
              className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-[#1E7F57] font-semibold text-white transition hover:bg-[#166b48] disabled:opacity-70"
            >
              {loading ? "Placing Order..." : "Confirm Payment"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}