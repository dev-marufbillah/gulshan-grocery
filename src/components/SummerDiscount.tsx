"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Offer kokhon shesh hobe, eikhane date bodlao
const END_DATE = "2026-10-31T23:59:59+06:00";

// Pore chobi dile path likho, jemon "/images/summer-left.jpg"
const LEFT_IMAGE: string | null = null;
const RIGHT_IMAGE: string | null = null;

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, new Date(END_DATE).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

function SidePhoto({
  image,
  emoji,
  gradient,
  alt,
}: {
  image: string | null;
  emoji: string;
  gradient: string;
  alt: string;
}) {
  return (
    <div
      className={`relative hidden h-[300px] overflow-hidden rounded-xl lg:block ${gradient}`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[110px]">
          {emoji}
        </div>
      )}
      <div className="pointer-events-none absolute inset-3 rounded-lg border border-white/80" />
    </div>
  );
}

export default function SummerDiscount() {
  const [t, setT] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => setT(getTimeLeft());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const units = [
    { label: "Days", value: t?.days ?? 0 },
    { label: "Hours", value: t?.hours ?? 0 },
    { label: "Minutes", value: t?.minutes ?? 0 },
    { label: "Seconds", value: t?.seconds ?? 0 },
  ];

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 md:px-6 lg:grid-cols-[260px_1fr_260px]">
        <SidePhoto
          image={LEFT_IMAGE}
          emoji="🛒"
          gradient="bg-gradient-to-b from-[#d9b98f] to-[#7a5a40]"
          alt="Shopping"
        />

        {/* Center card */}
        <div className="relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#F4F4F4] px-6 py-10 text-center">
          <span className="absolute -left-2 -top-2 rotate-[-20deg] text-7xl md:text-8xl">
            🍊
          </span>
          <span className="absolute -bottom-2 -right-2 text-6xl md:text-7xl">
            🍅
          </span>
          <span className="absolute bottom-6 right-16 rotate-12 text-5xl md:text-6xl">
            🍊
          </span>

          <h2 className="relative text-3xl font-semibold text-[#1a1a1a] md:text-4xl">
            Summer <span className="text-[#1E7F57]">Discount</span>
          </h2>
          <p className="relative mt-3 text-[#1a1a1a]">
            Get 50% off - Limited Time Offer!
          </p>

          {/* Countdown */}
          <div className="relative mt-6 flex items-start gap-3 md:gap-5">
            {units.map((u, i) => (
              <div key={u.label} className="flex items-start gap-3 md:gap-5">
                <div className="flex w-14 flex-col items-center md:w-[72px]">
                  <span className="text-3xl font-semibold text-[#1a1a1a] md:text-4xl">
                    {pad(u.value)}
                  </span>
                  <span className="mt-1 text-sm text-[#6b6b6b]">{u.label}</span>
                </div>
                {i < units.length - 1 && (
                  <span className="text-3xl font-semibold text-[#1a1a1a] md:text-4xl">
                    :
                  </span>
                )}
              </div>
            ))}
          </div>

          <Link
            href="/shop"
            className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-[#1E7F57] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#186a48]"
          >
            Shop Now
            <ArrowRight size={18} />
          </Link>
        </div>

        <SidePhoto
          image={RIGHT_IMAGE}
          emoji="🥬"
          gradient="bg-gradient-to-b from-[#6b8f7a] to-[#2f4a3c]"
          alt="Fresh vegetables"
        />
      </div>
    </section>
  );
}