"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, CreditCard, Banknote } from "lucide-react";
import { FaPaypal, FaCcVisa, FaGooglePay } from "react-icons/fa";
import { useCartStore } from "@/store/cart";

const METHOD_LABELS: Record<string, string> = {
  paypal: "Paypal",
  visa: "Visa Card",
  googlepay: "Google Pay",
  cod: "Cash On Delivery",
  newcard: "Credit/Debit Card",
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

  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [loading, setLoading] = useState(false);

  const subTotal = totalPrice;
  const shipping = items.length > 0 && subTotal < 500 ? 60 : 0;
  const taxes = 0;
  const discount = 0;
  const total = subTotal + shipping + taxes - discount;

  const handleConfirmPayment = async () => {
    setLoading(true);

    const orderId = makeOrderId();
    const txnId = makeTxnId();
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
      // 🌟 Real DB Save via API
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
        }),
      });

      // Local Session Backup for Success Screen
      sessionStorage.setItem("gulshan-last-order", JSON.stringify(snapshot));

      // Clear Cart
      clearCart();

      // Redirect
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
            <label
              className={`flex cursor-pointer items-center gap-4 rounded-xl border px-6 py-5 transition ${
                paymentMethod === "paypal"
                  ? "border-[#1E7F57] bg-[#F4F9F7]"
                  : "border-[#e5e5e5] hover:border-[#1E7F57]"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                className="h-5 w-5 cursor-pointer accent-[#1E7F57]"
              />
              <FaPaypal className="text-[#00457C]" size={24} />
              <span className="font-semibold text-[#1a1a1a]">Paypal</span>
            </label>

            <label
              className={`flex cursor-pointer items-center gap-4 rounded-xl border px-6 py-5 transition ${
                paymentMethod === "visa"
                  ? "border-[#1E7F57] bg-[#F4F9F7]"
                  : "border-[#e5e5e5] hover:border-[#1E7F57]"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="visa"
                checked={paymentMethod === "visa"}
                onChange={() => setPaymentMethod("visa")}
                className="h-5 w-5 cursor-pointer accent-[#1E7F57]"
              />
              <FaCcVisa className="text-[#1434CB]" size={28} />
              <span className="font-semibold text-[#1a1a1a]">
                **** **** **** 8047
              </span>
            </label>

            <label
              className={`flex cursor-pointer items-center gap-4 rounded-xl border px-6 py-5 transition ${
                paymentMethod === "googlepay"
                  ? "border-[#1E7F57] bg-[#F4F9F7]"
                  : "border-[#e5e5e5] hover:border-[#1E7F57]"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="googlepay"
                checked={paymentMethod === "googlepay"}
                onChange={() => setPaymentMethod("googlepay")}
                className="h-5 w-5 cursor-pointer accent-[#1E7F57]"
              />
              <FaGooglePay className="text-[#1a1a1a]" size={36} />
              <span className="-ml-2 font-semibold text-[#1a1a1a]">
                Google Pay
              </span>
            </label>

            <label
              className={`flex cursor-pointer items-center gap-4 rounded-xl border px-6 py-5 transition ${
                paymentMethod === "cod"
                  ? "border-[#1E7F57] bg-[#F4F9F7]"
                  : "border-[#e5e5e5] hover:border-[#1E7F57]"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="h-5 w-5 cursor-pointer accent-[#1E7F57]"
              />
              <Banknote className="text-[#1E7F57]" size={24} />
              <span className="font-semibold text-[#1a1a1a]">
                Cash On Delivery
              </span>
            </label>

            <div
              className={`overflow-hidden rounded-xl border transition ${
                paymentMethod === "newcard"
                  ? "border-[#1E7F57] bg-[#F4F9F7]"
                  : "border-[#e5e5e5]"
              }`}
            >
              <label className="flex cursor-pointer items-center gap-4 px-6 py-5 transition hover:bg-[#F4F9F7]">
                <input
                  type="radio"
                  name="payment"
                  value="newcard"
                  checked={paymentMethod === "newcard"}
                  onChange={() => setPaymentMethod("newcard")}
                  className="h-5 w-5 cursor-pointer accent-[#1E7F57]"
                />
                <CreditCard className="text-[#1E7F57]" size={24} />
                <span className="font-semibold text-[#1a1a1a]">
                  Add New Credit/Debit Card
                </span>
              </label>

              {paymentMethod === "newcard" && (
                <div className="border-t border-[#1E7F57]/20 px-6 pb-6 pt-6">
                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                        Card Holder Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex. John Doe"
                        className="w-full rounded-full border border-[#e5e5e5] bg-white px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        placeholder="4716 9627 1635 8047"
                        className="w-full rounded-full border border-[#e5e5e5] bg-white px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          placeholder="02/30"
                          className="w-full rounded-full border border-[#e5e5e5] bg-white px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                          CVV *
                        </label>
                        <input
                          type="password"
                          placeholder="000"
                          className="w-full rounded-full border border-[#e5e5e5] bg-white px-5 py-3 text-sm outline-none focus:border-[#1E7F57]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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