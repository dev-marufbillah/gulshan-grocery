"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function ContactClient() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSent(false), 3000);
    }, 600);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="Ex. John"
                className="w-full rounded-full border border-[#e5e5e5] px-5 py-3.5 text-sm outline-none transition focus:border-[#1E7F57]"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="Ex. Doe"
                className="w-full rounded-full border border-[#e5e5e5] px-5 py-3.5 text-sm outline-none transition focus:border-[#1E7F57]"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                placeholder="example@gmail.com"
                className="w-full rounded-full border border-[#e5e5e5] px-5 py-3.5 text-sm outline-none transition focus:border-[#1E7F57]"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="tel"
                placeholder="Enter Phone Number"
                className="w-full rounded-full border border-[#e5e5e5] px-5 py-3.5 text-sm outline-none transition focus:border-[#1E7F57]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="Enter here.."
              className="w-full rounded-full border border-[#e5e5e5] px-5 py-3.5 text-sm outline-none transition focus:border-[#1E7F57]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
              Your Message <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              placeholder="Enter here.."
              className="w-full resize-none rounded-2xl border border-[#e5e5e5] px-5 py-4 text-sm outline-none transition focus:border-[#1E7F57]"
            />
          </div>

          {sent && (
            <p className="text-sm font-semibold text-[#1E7F57]">
              Message sent successfully! We will contact you soon.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#1E7F57] px-10 py-3.5 text-sm font-semibold text-white transition hover:bg-[#166b48] disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send a Message"}
          </button>
        </form>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#e8f5ee] to-[#d4ebe0] shadow-lg">
            <div className="flex aspect-4/5 flex-col items-center justify-center p-8 text-center md:aspect-auto md:min-h-130">
              <div className="text-8xl">🛒🥬🍎</div>
              <p className="mt-6 text-2xl font-bold text-[#1a1a1a]">
                We&apos;re here to help!
              </p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#4b4b4b]">
                Visit our Gulshan store or send a message. Fresh groceries and
                friendly support every day.
              </p>
              <div className="mt-8 flex gap-3 text-4xl">
                <span>🥦</span>
                <span>🍊</span>
                <span>🥖</span>
                <span>🥛</span>
              </div>
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#FBC617] text-[#1a1a1a] shadow-md">
            <Sparkles size={22} />
          </span>
        </div>
      </div>
    </section>
  );
}