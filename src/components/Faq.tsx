"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

type FaqItem = {
  q: string;
  a: string;
};

const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    q: "Are the products fresh and of high quality?",
    a: "Yes! We source our fresh fruits, vegetables, dairy, and meat directly from trusted local farms in Bangladesh every morning to guarantee peak freshness and quality.",
  },
  {
    q: "What are your delivery hours?",
    a: "We deliver every day from 9:00 AM to 10:00 PM across Gulshan, Banani, Baridhara, and nearby areas in Dhaka. Express delivery options are also available.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Cash on Delivery (COD), bKash, Nagad, as well as Visa and MasterCard debit or credit cards through secure payment gateways.",
  },
  {
    q: "Do you offer any discounts or promotions?",
    a: "Yes! New users get 25% off on their first order upon registration. We also offer weekly deals, flat discounts, and seasonal offers on daily essentials.",
  },
  {
    q: "How can I provide feedback about my experience?",
    a: "You can leave product reviews directly on the product details page, rate your experience in 'My Orders', or contact our support team via our Contact Us page.",
  },
  {
    q: "Do you offer bulk ordering for events or businesses?",
    a: "Yes, we handle bulk orders for offices, events, and restaurants in Gulshan and surrounding Dhaka areas with custom pricing and scheduled delivery.",
  },
];

type FaqProps = {
  data?: {
    show?: boolean;
    subtitle?: string;
    title?: string;
    items?: FaqItem[];
  } | null;
};

export default function Faq({ data }: FaqProps = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  if (data && data.show === false) return null;

  const subtitle = data?.subtitle || "News & Blogs";
  const title = data?.title || "Our Latest News & Blogs";
  const items = data?.items && data.items.length > 0 ? data.items : DEFAULT_FAQ_ITEMS;

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold text-[#6b6b6b]">{subtitle}</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl md:text-5xl">
            {title}
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`overflow-hidden rounded-2xl transition-all duration-300 ${
                  isOpen
                    ? "bg-[#1E7F57] text-white shadow-md"
                    : "bg-[#F4F4F4] text-[#1a1a1a] hover:bg-[#eaeaea]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4.5 text-left font-bold text-sm md:text-base cursor-pointer outline-none"
                >
                  <span>{item.q}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform ${
                      isOpen ? "text-[#FBC617]" : "text-[#1a1a1a]"
                    }`}
                  >
                    {isOpen ? <Minus size={18} strokeWidth={2.5} /> : <Plus size={18} strokeWidth={2.5} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-white/90 animate-in fade-in duration-300">
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