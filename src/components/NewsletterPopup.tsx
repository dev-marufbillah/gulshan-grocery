"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // পপআপটি একবার দেখালে আর দেখাবে না (sessionStorage)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      alert("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // 🌟 Real DB API Call
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setHasSubscribed(true);
        setTimeout(() => {
          setIsOpen(false);
        }, 2500);
      } else {
        setErrorMsg(data.error || "Failed to subscribe. Try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-300">
      {/* Modal Card */}
      <div className="relative flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95">
        
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-[#FBC617] text-[#1a1a1a] shadow-md transition hover:scale-110 hover:bg-yellow-500 cursor-pointer"
          aria-label="Close popup"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="flex w-full flex-col md:flex-row">
          
          {/* 🌟 Left Image Side (Exact Figma Supermarket Photo & Sparkles) */}
          <div className="relative hidden w-1/2 overflow-hidden md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
              alt="Grocery Shopping Woman"
              className="h-full w-full object-cover object-center"
            />

            {/* Figma Yellow Star Sparkles Overlay */}
            <div className="pointer-events-none absolute -right-6 bottom-16 z-20 text-[#FBC617]">
              <svg className="h-16 w-16 drop-shadow-md" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0 L55 40 L95 45 L55 50 L50 90 L45 50 L5 45 L45 40 Z" />
              </svg>
            </div>
            <div className="pointer-events-none absolute -right-2 bottom-32 z-20 text-[#FBC617]">
              <svg className="h-8 w-8 drop-shadow-sm" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0 L55 40 L95 45 L55 50 L50 90 L45 50 L5 45 L45 40 Z" />
              </svg>
            </div>
          </div>

          {/* Right Form Side */}
          <div className="flex w-full flex-col justify-center px-6 py-10 md:w-1/2 md:px-10 lg:px-12">
            <p className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider">
              Subscribe To Our Newsletter
            </p>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-[#1a1a1a]">
              Get Weekly Newsletter
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-[#6b6b6b]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
            </p>

            {hasSubscribed ? (
              <div className="mt-8 flex flex-col items-center justify-center rounded-2xl bg-[#E8F3EE] p-6 text-center text-[#1E7F57] animate-in fade-in">
                <CheckCircle2 size={40} className="mb-2 text-[#1E7F57]" />
                <h3 className="text-lg font-bold">Subscription Successful!</h3>
                <p className="mt-1 text-xs text-[#1E7F57]/80">
                  Thank you for joining Gulshan Grocery newsletter.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {errorMsg && (
                  <p className="text-xs font-bold text-red-500 bg-red-50 p-2.5 rounded-lg">
                    {errorMsg}
                  </p>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#1a1a1a]">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Your Name"
                    className="w-full rounded-full border border-[#e5e5e5] px-5 py-3 text-sm outline-none transition focus:border-[#1E7F57] bg-white text-[#1a1a1a]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#1a1a1a]">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email Address"
                    className="w-full rounded-full border border-[#e5e5e5] px-5 py-3 text-sm outline-none transition focus:border-[#1E7F57] bg-white text-[#1a1a1a]"
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-[#1E7F57]"
                  />
                  <span className="text-xs text-[#1a1a1a] leading-tight">
                    Agree with{" "}
                    <Link
                      href="/faq"
                      className="font-semibold underline underline-offset-2 hover:text-[#1E7F57]"
                    >
                      Terms &amp; Condition
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/faq"
                      className="font-semibold underline underline-offset-2 hover:text-[#1E7F57]"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-3 w-full rounded-full bg-[#1E7F57] py-3.5 text-sm font-bold text-white transition hover:bg-[#166b48] disabled:opacity-70 cursor-pointer shadow-md"
                >
                  {loading ? "Subscribing..." : "Subscribe Now"}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}