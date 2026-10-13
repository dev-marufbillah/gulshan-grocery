"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { ShoppingBasket } from "lucide-react";

const LAUNCH_DATE = new Date("2025-12-31T00:00:00").getTime();

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calcTimeLeft(now: number): TimeLeft {
  const diff = Math.max(0, LAUNCH_DATE - now);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const tickListeners = new Set<() => void>();
let tickStarted = false;
let currentNow = 0;

function ensureTicker() {
  if (tickStarted || typeof window === "undefined") return;
  tickStarted = true;
  currentNow = Date.now();
  setInterval(() => {
    currentNow = Date.now();
    tickListeners.forEach((l) => l());
  }, 1000);
}

function subscribeTick(onStoreChange: () => void) {
  ensureTicker();
  tickListeners.add(onStoreChange);
  return () => {
    tickListeners.delete(onStoreChange);
  };
}

function getTickSnapshot() {
  if (typeof window === "undefined") return 0;
  ensureTicker();
  return currentNow || Date.now();
}

function getServerTickSnapshot() {
  return 0;
}

const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function ComingSoonClient() {
  const now = useSyncExternalStore(
    subscribeTick,
    getTickSnapshot,
    getServerTickSnapshot
  );

  const mounted = useHydrated();

  const time = useMemo(
    () =>
      now
        ? calcTimeLeft(now)
        : { days: 0, hours: 0, minutes: 0, seconds: 0 },
    [now]
  );

  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 3000);
  };

  const blocks = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        {/* LEFT */}
        <div className="flex flex-col justify-between px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1E7F57] text-[#FBC617]">
                <ShoppingBasket size={22} />
              </span>
              <span className="text-xl font-bold text-[#1a1a1a]">
                Grocery<span className="text-[#1E7F57]">.</span>
              </span>
            </Link>

            <p className="mt-14 text-base font-medium text-[#6b6b6b]">
              Coming Soon
            </p>
            <h1 className="mt-3 max-w-md text-4xl font-bold leading-tight text-[#1a1a1a] sm:text-5xl">
              Get Notified{" "}
              <span className="text-[#1E7F57]">When We Launch!</span>
            </h1>

            <div className="mt-10 flex items-end gap-0 sm:gap-2">
              {blocks.map((b, i) => (
                <div key={b.label} className="flex items-end">
                  <div className="min-w-17.5 text-center sm:min-w-22">
                    <p className="text-4xl font-bold tabular-nums text-[#1a1a1a] sm:text-5xl">
                      {mounted && now ? pad(b.value) : "00"}
                    </p>
                    <p className="mt-2 text-sm text-[#6b6b6b]">{b.label}</p>
                  </div>
                  {i < blocks.length - 1 && (
                    <span className="mb-8 hidden h-10 w-px bg-[#e5e5e5] sm:mx-3 sm:block" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 max-w-md">
              <p className="text-sm text-[#6b6b6b]">
                Get notified when site goes live:
              </p>
              <form
                onSubmit={handleSubscribe}
                className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 flex-1 rounded-full border border-[#e5e5e5] px-5 text-sm outline-none transition focus:border-[#1E7F57]"
                />
                <button
                  type="submit"
                  className="h-12 shrink-0 rounded-full bg-[#1E7F57] px-8 text-sm font-semibold text-white transition hover:bg-[#166b48]"
                >
                  Subscribe
                </button>
              </form>
              {done && (
                <p className="mt-3 text-sm font-semibold text-[#1E7F57]">
                  Thanks! We&apos;ll notify you when we launch.
                </p>
              )}
            </div>

            <div className="mt-10 flex items-center gap-3">
              {[
                { Icon: FaFacebookF, label: "Facebook" },
                { Icon: FaTwitter, label: "Twitter" },
                { Icon: FaPinterestP, label: "Pinterest" },
                { Icon: FaInstagram, label: "Instagram" },
                { Icon: FaYoutube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FBC617] text-[#1a1a1a] transition hover:bg-yellow-400"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <p className="mt-12 text-xs text-[#9a9a9a] lg:mt-0">
            Copyright © 2024 Grocery Website Design. All Rights Reserved.
          </p>
        </div>

        {/* RIGHT */}
        <div className="relative hidden overflow-hidden lg:block">
          <div className="absolute inset-4 overflow-hidden rounded-[2rem] bg-linear-to-br from-[#e8f0ff] to-[#d4e4ff]">
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="text-[120px] leading-none">🛍️👩</div>
              <p className="mt-6 max-w-xs text-lg font-semibold text-[#1a1a1a]">
                Fresh groceries, coming to Gulshan soon
              </p>
              <div className="mt-6 flex gap-3 text-4xl">
                <span>🍎</span>
                <span>🥬</span>
                <span>🥖</span>
                <span>🥛</span>
              </div>
            </div>
          </div>

          <svg
            className="pointer-events-none absolute right-8 top-16 h-28 w-28 text-[#FBC617]"
            viewBox="0 0 100 100"
            fill="currentColor"
            aria-hidden
          >
            <path d="M50 0 L55 40 L95 45 L55 50 L50 90 L45 50 L5 45 L45 40 Z" />
          </svg>
          <svg
            className="pointer-events-none absolute right-24 top-10 h-10 w-10 text-[#FBC617]"
            viewBox="0 0 100 100"
            fill="currentColor"
            aria-hidden
          >
            <path d="M50 0 L55 40 L95 45 L55 50 L50 90 L45 50 L5 45 L45 40 Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}