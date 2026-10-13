"use client";

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(true);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("seen-newsletter-popup");

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("seen-newsletter-popup", "true");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      alert("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }
    setHasSubscribed(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-300">
      <div className="relative flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#FBC617] text-[#1a1a1a] shadow transition hover:scale-110 hover:bg-yellow-500"
          aria-label="Close popup"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="flex w-full flex-col md:flex-row">
          <div className="relative hidden w-1/2 overflow-hidden bg-linear-to-br from-[#e8f5ee] to-[#cfe8da] md:block">
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
              <div className="text-[120px] leading-none">🛍️👩</div>
              <p className="mt-4 text-xl font-bold text-[#1E7F57]">
                Fresh Groceries
              </p>
              <p className="text-sm text-[#1E7F57]/80">Delivered to you</p>
            </div>

            <span className="absolute -right-5 bottom-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#FBC617] text-[#1a1a1a] shadow-lg">
              <Sparkles size={28} />
            </span>
          </div>

          <div className="flex w-full flex-col justify-center px-6 py-10 md:w-1/2 md:px-10 lg:px-12">
            <p className="text-sm font-semibold text-[#6b6b6b]">
              Subscribe To Our Newsletter
            </p>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-[#1a1a1a]">
              Get Weekly Newsletter
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore.
            </p>

            {hasSubscribed ? (
              <div className="mt-8 rounded-2xl bg-[#E8F3EE] p-6 text-center text-[#1E7F57]">
                <h3 className="text-xl font-bold">Thank You!</h3>
                <p className="mt-2 text-sm">
                  You have successfully subscribed to our weekly newsletter.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Your Name"
                    className="w-full rounded-full border border-[#e5e5e5] px-5 py-3.5 text-sm outline-none transition focus:border-[#1E7F57]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                    Email *
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

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-[#1E7F57]"
                  />
                  <span className="text-sm text-[#1a1a1a]">
                    Agree with{" "}
                    <Link
                      href="/terms"
                      className="font-semibold underline underline-offset-4 hover:text-[#1E7F57]"
                    >
                      Terms & Condition
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-semibold underline underline-offset-4 hover:text-[#1E7F57]"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-full bg-[#1E7F57] py-3.5 text-sm font-bold text-white transition hover:bg-[#166b48]"
                >
                  Subscribe Now
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}