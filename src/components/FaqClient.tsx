"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

type FaqItem = {
  q: string;
  a: string;
};

const FAQ_DATA: Record<string, FaqItem[]> = {
  "General Information": [
    {
      q: "Are the products fresh and of high quality?",
      a: "Yes. We source fruits, vegetables and daily essentials from trusted local farms and suppliers in Bangladesh. Every item is checked for freshness before delivery.",
    },
    {
      q: "What are your delivery hours?",
      a: "We deliver every day from 9:00 AM to 10:00 PM across Gulshan, Banani, Baridhara and selected areas of Dhaka. Same-day delivery is available for orders placed before 6:00 PM.",
    },
    {
      q: "What payment methods do you accept?",
      a: "You can pay with bKash, Nagad, credit/debit cards, or Cash on Delivery (COD). All online payments are secure.",
    },
    {
      q: "Do you offer any discounts or promotions?",
      a: "Yes. New customers get 25% off on the first order when they subscribe to our newsletter. We also run weekly deals on fruits, vegetables and essentials.",
    },
    {
      q: "How can I provide feedback about my experience?",
      a: "You can rate products on the product page, email support@gulshangrocery.com, or use the Contact Us form.",
    },
    {
      q: "Do you offer bulk ordering for events or business?",
      a: "Yes. For offices, parties and bulk orders in Dhaka, contact us with your list. We offer special pricing for large orders.",
    },
  ],
  "Ordering and Payment": [
    {
      q: "How do I place an order?",
      a: "Browse the shop, add items to cart, go to checkout, enter your address and choose a payment method.",
    },
    {
      q: "Can I cancel or change my order?",
      a: "You can cancel before the order is packed. Contact support with your Order ID as soon as possible.",
    },
    {
      q: "Is Cash on Delivery available?",
      a: "Yes, COD is available for most addresses in Gulshan and nearby areas.",
    },
    {
      q: "What if payment fails?",
      a: "If a payment fails, the order is not placed. You can try again or choose Cash on Delivery.",
    },
  ],
  "Delivery and Pickup": [
    {
      q: "Which areas do you deliver to?",
      a: "We primarily deliver in Gulshan, Banani, Baridhara, Niketan and selected parts of Dhaka.",
    },
    {
      q: "Is delivery free?",
      a: "Delivery is free for orders above ৳500. Below that, a small delivery charge may apply.",
    },
    {
      q: "How long does delivery take?",
      a: "Most orders in Gulshan arrive within 1–3 hours. Track anytime from Track Your Order.",
    },
  ],
  "Products and Availability": [
    {
      q: "What if an item is out of stock?",
      a: "Out-of-stock items cannot be added to cart. Similar alternatives are often shown on the shop page.",
    },
    {
      q: "Do you sell organic products?",
      a: "We offer selected organic and farm-fresh options. Check labels on the product page.",
    },
  ],
  "Account & Profile": [
    {
      q: "Do I need an account to order?",
      a: "You can browse without an account. An account makes checkout faster and order tracking easier.",
    },
    {
      q: "How do I reset my password?",
      a: "On the login page, use Forgot Password and follow the email link.",
    },
  ],
};

const CATEGORIES = Object.keys(FAQ_DATA);

export default function FaqClient() {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0]);
  const [openIndex, setOpenIndex] = useState(1);

  const items = FAQ_DATA[activeCat] || [];

  const handleCategory = (cat: string) => {
    setActiveCat(cat);
    setOpenIndex(0);
  };

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? -1 : i));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
        <aside className="flex flex-col gap-3">
          {CATEGORIES.map((cat) => {
            const active = cat === activeCat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategory(cat)}
                className={`rounded-2xl px-6 py-4 text-left text-sm font-semibold transition ${
                  active
                    ? "bg-[#FBC617] text-[#1a1a1a] shadow-sm"
                    : "border border-[#e5e5e5] bg-white text-[#1a1a1a] hover:border-[#1E7F57]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </aside>

        <div className="flex flex-col gap-4">
          {items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div
                key={item.q}
                className={`overflow-hidden rounded-2xl border transition ${
                  open
                    ? "border-[#1E7F57] bg-[#1E7F57] text-white"
                    : "border-[#e5e5e5] bg-white text-[#1a1a1a]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold md:text-base">
                    {item.q}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center">
                    {open ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>

                {open && (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-white/90">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}