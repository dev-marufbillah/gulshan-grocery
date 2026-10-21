"use client";

import { useState } from "react";
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
  X,
  Sparkles,
  Users,
  Award,
  Truck,
  Leaf,
  Clock,
  HeartHandshake,
} from "lucide-react";

// Dynamic Feature Points
const POINTS = [
  "100% Organic & Locally Sourced Fresh Produce",
  "Zero Quality Compromise with Multi-tier Inspection",
  "30-Minute Express Delivery across Gulshan & Banani",
  "Eco-Friendly Recyclable Packaging Systems",
];

// Dynamic Team Data
const TEAM = [
  {
    name: "Jenny Alexander",
    role: "Founder & CEO",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    bio: "Ex-Supply Chain Director with 12+ years in grocery retail.",
  },
  {
    name: "Bessie Cooper",
    role: "Head of Operations",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    bio: "Logistics expert ensuring sub-30 minute delivery times.",
  },
  {
    name: "Jane Cooper",
    role: "Quality Assurance Lead",
    image:
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=600&auto=format&fit=crop",
    bio: "Certified nutritionist managing farm-to-door quality checks.",
  },
  {
    name: "Robert Fox",
    role: "Inventory & Sourcing Head",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    bio: "Directly partnering with 50+ local organic farmers.",
  },
];

// Key Milestones / Stats
const STATS = [
  { label: "Years of Service", value: "16+", icon: Clock },
  { label: "Happy Customers", value: "15,000+", icon: Users },
  { label: "Organic Products", value: "1,200+", icon: Leaf },
  { label: "On-Time Delivery", value: "99.4%", icon: Truck },
];

export default function AboutPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <main className="bg-white text-[#1a1a1a]">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-linear-to-b from-[#F0F7F3] via-[#F9F9F9] to-white py-16 lg:py-24 text-center">
        {/* Decorative Grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#1E7F57 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1E7F57]/20 bg-white/80 px-4 py-1.5 shadow-xs backdrop-blur-md mb-4">
            <Sparkles size={14} className="text-[#1E7F57]" />
            <span className="text-xs font-semibold text-[#1E7F57] uppercase tracking-wider">
              Our Story & Heritage
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-[#1a1a1a] sm:text-5xl lg:text-6xl">
            Redefining Freshness in{" "}
            <span className="bg-linear-to-r from-[#1E7F57] to-[#166b48] bg-clip-text text-transparent">
              Gulshan & Dhaka
            </span>
          </h1>

          <p className="mt-4 text-base text-[#6b6b6b] sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We bridge the gap between fresh local farms and your kitchen, ensuring
            uncompromised quality, speed, and safety for your family every single day.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-[#6b6b6b]">
            <Link href="/" className="hover:text-[#1E7F57] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#1E7F57] font-semibold">About Us</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN STORY SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:py-20 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Interactive Media Player Placeholder */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border-4 border-white bg-gray-100 shadow-2xl aspect-4/3 group">
              {/* Main High-Res Stock Photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop"
                alt="Fresh Grocery Market"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

              {/* Video Play Button */}
              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                aria-label="Play Video"
                className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1E7F57] shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white group-hover:shadow-[#1E7F57]/30"
              >
                <span className="absolute inset-0 rounded-full bg-[#1E7F57]/20 animate-ping" />
                <Play size={32} className="ml-1 fill-[#1E7F57]" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs uppercase tracking-widest font-semibold text-[#FBC617]">
                  Watch Our Journey
                </p>
                <p className="text-lg font-bold">From Local Organic Farms directly to Your Table</p>
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -left-3 -bottom-6 rounded-2xl bg-linear-to-br from-[#FBC617] to-[#e5b307] p-5 shadow-xl md:-left-6 border-2 border-white">
              <div className="flex items-center gap-3">
                <p className="text-4xl font-black text-[#1a1a1a] leading-none">16</p>
                <div className="text-xs font-black uppercase leading-tight text-[#1a1a1a]">
                  Years of
                  <br />
                  Excellence
                </div>
              </div>
            </div>
          </div>

          {/* Right: Detailed Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#E8F3EE] px-3 py-1 text-xs font-bold text-[#1E7F57] uppercase tracking-wider">
              <HeartHandshake size={14} />
              Trusted Neighborhood Grocery
            </div>

            <h2 className="mt-4 text-3xl font-black leading-tight text-[#1a1a1a] sm:text-4xl lg:text-5xl">
              Your Most Trusted Partner in{" "}
              <span className="text-[#1E7F57]">Fresh Grocery Delivery</span>
            </h2>

            <p className="mt-5 text-base leading-relaxed text-[#5b5b5b]">
              Founded in Gulshan, our journey started with a simple belief: every
              family deserves access to farm-fresh, chemical-free groceries without
              the hassle of crowded markets. Today, we serve thousands of households
              across Dhaka with top-tier fruits, vegetables, meat, and daily essentials.
            </p>

            {/* Dynamic Feature Checklist */}
            <ul className="mt-6 space-y-3">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm font-semibold text-[#1a1a1a]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1E7F57] text-white mt-0.5 shadow-xs">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* Founder Signature Block */}
            <div className="mt-8 flex items-center gap-5 border-t border-gray-100 pt-6">
              <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-[#1E7F57] shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
                  alt="Founder"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p
                  className="text-2xl font-bold text-[#1a1a1a] italic tracking-wide"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Jenny Alexander
                </p>
                <p className="text-xs font-semibold text-[#6b6b6b]">
                  Founder & CEO <span className="text-[#1E7F57]">• Gulshan Grocery</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC STATS / COUNTER BAR */}
      <section className="bg-linear-to-r from-[#1E7F57] to-[#166b48] py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md mb-3 text-[#FBC617]">
                  <stat.icon size={24} />
                </div>
                <p className="text-3xl font-black sm:text-4xl text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-white/80 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VISION & MISSION CARDS */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#1E7F57] uppercase tracking-widest">
            Driven by Purpose
          </span>
          <h2 className="mt-2 text-3xl font-black text-[#1a1a1a] sm:text-4xl">
            Our Core Vision & Strategic Mission
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Vision Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-[#F9F9F9] p-8 transition-all duration-300 hover:border-[#1E7F57]/30 hover:bg-white hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#1E7F57] to-[#166b48] text-white shadow-lg shadow-[#1E7F57]/20 group-hover:scale-110 transition-transform">
              <Rocket size={28} />
            </div>
            <h3 className="mt-6 text-2xl font-extrabold text-[#1a1a1a]">Our Vision</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">
              To become Dhaka’s benchmark for ultra-fresh grocery delivery by 2026—creating
              a sustainable supply chain that benefits both local farmers and suburban families
              with zero compromise on food purity.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#1E7F57]">
              <span>Sustainability First</span>
              <span>•</span>
              <span>100% Purity</span>
            </div>
          </div>

          {/* Mission Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-[#F9F9F9] p-8 transition-all duration-300 hover:border-[#1E7F57]/30 hover:bg-white hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#FBC617] to-[#e5b307] text-[#1a1a1a] shadow-lg shadow-[#FBC617]/20 group-hover:scale-110 transition-transform">
              <Eye size={28} />
            </div>
            <h3 className="mt-6 text-2xl font-extrabold text-[#1a1a1a]">Our Mission</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">
              Deliver top-grade groceries rapidly, maintain honest & transparent pricing,
              support local organic producers, and build an effortless online shopping
              ecosystem backed by 24/7 dedicated support.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#1E7F57]">
              <span>Fast Fulfillment</span>
              <span>•</span>
              <span>Fair Trade</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROFESSIONAL TEAM SECTION */}
      <section className="bg-[#F9F9F9] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1E7F57]">
              Leadership & Passion
            </p>
            <h2 className="mt-2 text-3xl font-black text-[#1a1a1a] sm:text-4xl">
              Meet The Experts Behind <span className="text-[#1E7F57]">Our Quality</span>
            </h2>
            <p className="mt-3 text-sm text-[#6b6b6b]">
              Our dedicated professionals work round the clock to ensure every apple,
              leaf, and package meets world-class grocery standards.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                {/* Image Container */}
                <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Info Container */}
                <div className="p-5 text-center">
                  <h4 className="text-lg font-bold text-[#1a1a1a]">{member.name}</h4>
                  <p className="text-xs font-bold text-[#1E7F57] mt-0.5">{member.role}</p>
                  <p className="mt-2 text-xs text-[#6b6b6b] leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRUST & FEATURES FOOTER BAR */}
      <section className="border-t border-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-[#F0F7F3]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8F3EE] text-[#1E7F57]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">Quality Guaranteed</h4>
                <p className="text-xs text-[#6b6b6b] mt-0.5">
                  100% money back if not satisfied with freshness
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-[#F0F7F3]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF7E0] text-[#e5b307]">
                <CreditCard size={24} />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">Secure Payments</h4>
                <p className="text-xs text-[#6b6b6b] mt-0.5">
                  bKash, Nagad, Cards & Cash on Delivery
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-[#F0F7F3]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8F3EE] text-[#1E7F57]">
                <Headphones size={24} />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">24/7 Dedicated Support</h4>
                <p className="text-xs text-[#6b6b6b] mt-0.5">
                  Instant help via Hotline & WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VIDEO POPUP MODAL */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-black shadow-2xl">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Gulshan Grocery Story"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}