import Link from "next/link";
import {
  Check,
  Play,
  Rocket,
  Eye,
  ShieldCheck,
  CreditCard,
  Headphones,
  Star,
} from "lucide-react";

export const metadata = { title: "About Us | Gulshan Grocery" };

const POINTS = [
  "Eco-Friendly and Sustainable Practices",
  "Fresh and High-Quality Groceries",
  "Convenient and Reliable Delivery",
];

const TEAM = [
  { name: "Jenny Alexander", role: "Founder & CEO", emoji: "👩‍💼" },
  { name: "Bessie Cooper", role: "Operations Manager", emoji: "👩‍💻" },
  { name: "Jane Cooper", role: "Warehouse Manager", emoji: "👩‍🔧" },
  { name: "Robert Fox", role: "Inventory Specialist", emoji: "👨‍💼" },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Banner */}
      <section
        className="relative bg-[#F9F9F9] py-14 text-center"
        style={{
          backgroundImage: "radial-gradient(#d9d9d9 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      >
        <h1 className="text-4xl font-bold text-[#1a1a1a]">About Us</h1>
        <p className="mt-3 text-sm font-medium text-[#6b6b6b]">
          <Link href="/" className="hover:text-[#1E7F57]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#1E7F57]">About Us</span>
        </p>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#e8f5ee] to-[#cfe8da]">
              <div className="flex aspect-4/3 flex-col items-center justify-center p-10 text-center">
                <div className="text-7xl md:text-8xl">🛒🥬🍎</div>
                <p className="mt-4 text-lg font-semibold text-[#1a1a1a]">
                  Fresh every day in Gulshan
                </p>
              </div>
              <button
                type="button"
                aria-label="Play video"
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1E7F57] shadow-lg transition hover:scale-105"
              >
                <Play size={28} fill="currentColor" className="ml-1" />
              </button>
            </div>
            <div className="absolute -left-2 top-8 rounded-2xl rounded-bl-none bg-[#FBC617] px-5 py-4 shadow-md md:-left-4">
              <p className="text-3xl font-bold leading-none text-[#1a1a1a]">
                16
              </p>
              <p className="mt-1 text-xs font-semibold leading-tight text-[#1a1a1a]">
                Years
                <br />
                of Services
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#6b6b6b]">
              About Us
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-[#1a1a1a] md:text-4xl">
              Your Trusted Partner in{" "}
              <span className="text-[#1E7F57]">Fresh Grocery Delivery</span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[#6b6b6b] md:text-base">
              Gulshan Grocery brings farm-fresh fruits, vegetables and daily
              essentials to your doorstep across Gulshan, Banani and nearby
              Dhaka. We focus on quality, fair prices and on-time delivery so
              your family always gets the best.
            </p>
            <ul className="mt-6 space-y-3">
              {POINTS.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-3 text-sm font-medium text-[#1a1a1a]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FBC617] text-[#1a1a1a]">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t border-[#e5e5e5] pt-6">
              <p
                className="text-2xl text-[#1a1a1a]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Jenny Alexander
              </p>
              <p className="mt-1 text-sm text-[#6b6b6b]">
                Jenny Alexander{" "}
                <span className="text-[#FBC617]">•</span> Founder
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wide image */}
      <section className="relative bg-[#F4F7F5] py-10 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#d4ebe0] via-[#e8f5ee] to-[#cfe8da] shadow-md">
            <div className="flex min-h-65 flex-col items-center justify-center gap-4 px-6 py-16 text-center md:min-h-80">
              <div className="text-6xl md:text-7xl">🏪🛒🥦🍊🥛</div>
              <p className="max-w-md text-lg font-semibold text-[#1a1a1a]">
                Serving Gulshan families with fresh groceries every day
              </p>
            </div>
            <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-[#FBC617] px-4 py-3 shadow-md">
              <div className="flex -space-x-2">
                {["👩", "👨", "👩", "🧑"].map((e, i) => (
                  <span
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white text-sm"
                  >
                    {e}
                  </span>
                ))}
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#1E7F57] text-xs font-bold text-white">
                  +
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={16} fill="#1a1a1a" className="text-[#1a1a1a]" />
                <div>
                  <p className="text-sm font-bold leading-none text-[#1a1a1a]">
                    4.8 Star
                  </p>
                  <p className="text-[11px] text-[#1a1a1a]/80">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="text-center md:text-left">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#1E7F57] text-white md:mx-0">
              <Rocket size={28} />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-[#1a1a1a]">
              Our Vision
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">
              To be Dhaka&apos;s most trusted neighbourhood grocery partner—
              making fresh, healthy food accessible to every home in Gulshan
              with care for people and the planet.
            </p>
          </div>
          <div className="text-center md:text-left">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#1E7F57] text-white md:mx-0">
              <Eye size={28} />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-[#1a1a1a]">
              Our Mission
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">
              Deliver high-quality groceries quickly and reliably, support local
              farmers, and give customers a simple, honest shopping experience
              online and offline.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#F9F9F9] py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#6b6b6b]">
              Our Team
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#1a1a1a] md:text-4xl">
              Meet The Passionate{" "}
              <span className="text-[#1E7F57]">Team Behind Our Success</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m) => (
              <div
                key={m.name}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-56 items-center justify-center bg-linear-to-b from-[#e8f5ee] to-[#f5f5f5] text-7xl">
                  {m.emoji}
                </div>
                <div className="px-4 py-5 text-center">
                  <h4 className="font-bold text-[#1a1a1a]">{m.name}</h4>
                  <p className="mt-1 text-sm text-[#6b6b6b]">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#e5e5e5] py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBC617] text-white">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">Free Shipping</h4>
                <p className="text-sm text-[#6b6b6b]">
                  Free shipping for order above ৳500
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBC617] text-white">
                <CreditCard size={28} />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">Flexible Payment</h4>
                <p className="text-sm text-[#6b6b6b]">
                  Multiple secure payment options
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBC617] text-white">
                <Headphones size={28} />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">24x7 Support</h4>
                <p className="text-sm text-[#6b6b6b]">
                  We support online all days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}