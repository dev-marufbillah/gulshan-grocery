"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingBasket,
  ShieldCheck,
  Truck,
  Star,
  Zap,
  Leaf,
  Award,
  Play,
  CheckCircle2,
  Package,
} from "lucide-react";

type SlideItem = {
  badge: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  image: string;
};

type HeroProps = {
  avgRating: number;
  customerCount: string | number;
  customSlides?: SlideItem[] | null;
  recentAvatars?: string[];
};

export default function Hero({
  avgRating,
  customerCount,
  customSlides,
  recentAvatars = [],
}: HeroProps) {
  const slides = customSlides && customSlides.length > 0 ? customSlides : [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  // ✅ FIXED: Single effect — no synchronous setState
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setCurrentSlide((prev) => (prev + 1) % slides.length);
          return 0;
        }
        return p + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [slides.length]);

  const safeIndex = slides.length > 0 ? currentSlide % slides.length : 0;
  const slide = slides[safeIndex];
  const totalCustomers = Number(customerCount) || 0;

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Top Decorative Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#1E7F57] via-[#FBC617] to-[#1E7F57] z-30" />

      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#1E7F57 1px, transparent 1px), linear-gradient(90deg, #1E7F57 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Side Decorative Shapes */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-linear-to-br from-[#1E7F57]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-linear-to-tr from-[#FBC617]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 py-10 lg:py-16">
        {/* Top Status Bar */}
        <div className="hidden lg:flex items-center justify-between mb-10 pb-4 border-b border-dashed border-gray-200">
          <div className="flex items-center gap-6 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span>Open Now · Delivering</span>
            </div>
            <div className="flex items-center gap-2">
              <Package size={14} className="text-[#1E7F57]" />
              <span>500+ Products Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-[#1E7F57]" />
              <span>Free Delivery over ৳500</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
            <span>📍</span>
            <span>Serving Gulshan, Dhaka</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* LEFT: Content - 7 columns */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            {/* Dynamic Badge */}
            <div className="inline-flex items-center gap-2.5 mb-6 lg:mb-8">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1E7F57]/10 border border-[#1E7F57]/20 rounded-full">
                <Zap size={12} className="text-[#1E7F57] fill-[#1E7F57]" />
                <span className="text-[11px] font-bold text-[#1E7F57] uppercase tracking-wider">
                  {slide?.badge || "Gulshan Grocery"}
                </span>
              </div>
              <div className="h-px w-8 bg-gray-300" />
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                New Arrivals
              </span>
            </div>

            {/* Massive Title */}
            <h1
              key={`title-${safeIndex}`}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700 text-[40px] sm:text-6xl lg:text-[80px] font-black leading-[0.95] tracking-tight text-[#0a0a0a]"
            >
              {slide?.titlePart1 || "Fresh Groceries "}
              <br />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 italic bg-linear-to-r from-[#1E7F57] to-[#2a9d6f] bg-clip-text text-transparent">
                  {slide?.titlePart2 || "Delivered Daily"}
                </span>
                <span className="absolute bottom-2 left-0 right-0 h-3 lg:h-4 bg-[#FBC617]/40 z-0 -rotate-1" />
              </span>
            </h1>

            {/* Description */}
            <p
              key={`desc-${safeIndex}`}
              className="animate-in fade-in slide-in-from-bottom-5 duration-700 mt-6 lg:mt-8 max-w-xl text-base lg:text-lg leading-relaxed text-gray-600"
            >
              {slide?.description ||
                "Order fresh fruits, vegetables, and daily essentials online. Fast delivery across Gulshan, Dhaka."}
            </p>

            {/* Feature List */}
            <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
              {[
                { icon: Leaf, label: "100% Organic" },
                { icon: Truck, label: "Fast Delivery" },
                { icon: Award, label: "Top Quality" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <CheckCircle2
                    size={16}
                    className="text-[#1E7F57] shrink-0"
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center gap-3 h-14 lg:h-16 px-8 lg:px-10 bg-[#0a0a0a] text-white font-bold text-base rounded-2xl overflow-hidden transition-all hover:bg-[#1E7F57] shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                <span className="absolute inset-0 bg-linear-to-r from-[#1E7F57] to-[#166b48] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <ShoppingBasket size={20} className="relative z-10" />
                <span className="relative z-10">Start Shopping</span>
                <div className="relative z-10 h-8 w-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </div>
              </Link>

              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-3 h-14 lg:h-16 px-6 bg-transparent border-2 border-gray-200 text-[#0a0a0a] font-bold text-base rounded-2xl hover:border-[#1E7F57] hover:bg-[#1E7F57]/5 transition-all"
              >
                <div className="h-8 w-8 rounded-full bg-[#1E7F57]/10 flex items-center justify-center group-hover:bg-[#1E7F57] transition-colors">
                  <Play
                    size={12}
                    className="text-[#1E7F57] fill-[#1E7F57] group-hover:text-white group-hover:fill-white ml-0.5 transition-colors"
                  />
                </div>
                <span>How It Works</span>
              </Link>
            </div>

            {/* Stats Row */}
            {(totalCustomers > 0 || avgRating > 0) && (
              <div className="mt-10 lg:mt-12 flex flex-wrap items-center gap-6 lg:gap-10 pt-8 border-t border-gray-100">
                {/* Avatars + Customers */}
                {totalCustomers > 0 && (
                  <div className="flex items-center gap-3">
                    {recentAvatars && recentAvatars.length > 0 ? (
                      <div className="flex -space-x-3">
                        {recentAvatars.slice(0, 4).map((url, i) => (
                          <div
                            key={i}
                            className="relative h-11 w-11 overflow-hidden rounded-full border-[3px] border-white bg-gray-100 shadow-md hover:scale-110 hover:z-10 transition-transform"
                            style={{ zIndex: 4 - i }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt="Customer"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-linear-to-br from-[#1E7F57] to-[#166b48] flex items-center justify-center text-white font-bold shadow-md">
                        {totalCustomers}+
                      </div>
                    )}
                    <div>
                      <p className="text-xl lg:text-2xl font-black text-[#0a0a0a] leading-none">
                        {totalCustomers}+
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        Happy Customers
                      </p>
                    </div>
                  </div>
                )}

                {/* Divider */}
                {totalCustomers > 0 && avgRating > 0 && (
                  <div className="h-12 w-px bg-gray-200" />
                )}

                {/* Rating */}
                {avgRating > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.round(avgRating)
                              ? "fill-[#FBC617] text-[#FBC617]"
                              : "fill-gray-200 text-gray-200"
                          }
                        />
                      ))}
                    </div>
                    <div>
                      <p className="text-xl lg:text-2xl font-black text-[#0a0a0a] leading-none">
                        {avgRating.toFixed(1)}
                        <span className="text-sm text-gray-400">/5.0</span>
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        Average Rating
                      </p>
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="h-12 w-px bg-gray-200 hidden sm:block" />

                {/* Delivery Stats */}
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-[#FBC617]/20 flex items-center justify-center">
                    <Truck size={18} className="text-[#1E7F57]" />
                  </div>
                  <div>
                    <p className="text-xl lg:text-2xl font-black text-[#0a0a0a] leading-none">
                      30<span className="text-sm text-gray-400">min</span>
                    </p>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      Avg Delivery
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Image Gallery - 5 columns */}
          <div className="lg:col-span-5 order-1 lg:order-2 relative">
            <div className="relative">
              {/* Main Image Card */}
              <div className="relative aspect-4/5 w-full max-w-md mx-auto lg:max-w-none overflow-hidden rounded-[2.5rem] bg-linear-to-br from-[#E8F3EE] to-white shadow-2xl shadow-[#1E7F57]/20">
                {/* Image Slides */}
                {slides.length > 0 ? (
                  slides.map((s, i) => (
                    <div
                      key={i}
                      className={`absolute inset-0 transition-all duration-1000 ${
                        safeIndex === i
                          ? "z-10 opacity-100 scale-100"
                          : "z-0 opacity-0 scale-110"
                      }`}
                    >
                      {s.image && s.image.length > 5 ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={s.image}
                          alt="Grocery"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBasket
                            size={64}
                            className="text-[#1E7F57]/40"
                          />
                        </div>
                      )}
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a]/70 via-transparent to-transparent" />
                    </div>
                  ))
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ShoppingBasket size={64} className="text-[#1E7F57]/40" />
                  </div>
                )}

                {/* Top Right Badge - Slide Count */}
                {slides.length > 1 && (
                  <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg">
                    <span className="text-sm font-black text-[#0a0a0a]">
                      {String(safeIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs text-gray-400">/</span>
                    <span className="text-xs font-semibold text-gray-500">
                      {String(slides.length).padStart(2, "0")}
                    </span>
                  </div>
                )}

                {/* Top Left Badge - Live */}
                <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-red-500 text-white rounded-full px-3 py-1.5 shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Live
                  </span>
                </div>

                {/* Bottom Info Card */}
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-[#1E7F57] uppercase tracking-wider mb-1">
                          Featured Today
                        </p>
                        <p className="text-sm font-black text-[#0a0a0a]">
                          Fresh From Farm
                        </p>
                      </div>
                      <Link
                        href="/shop"
                        className="flex items-center gap-1 text-xs font-bold text-[#1E7F57] hover:gap-2 transition-all"
                      >
                        Explore
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                    {/* Progress Bar */}
                    {slides.length > 1 && (
                      <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-[#1E7F57] to-[#2a9d6f] transition-all duration-100 ease-linear"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating Mini Card 1 - Fast Delivery */}
              <div className="absolute -left-4 top-16 z-20 lg:-left-8 bg-white rounded-2xl p-3 shadow-2xl border border-gray-100 animate-float">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-[#1E7F57] to-[#166b48] flex items-center justify-center shadow-md">
                    <Truck size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#0a0a0a]">
                      Express
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium">
                      30 min delivery
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Mini Card 2 - Secure */}
              <div
                className="absolute -right-3 bottom-24 z-20 lg:-right-6 bg-white rounded-2xl p-3 shadow-2xl border border-gray-100 animate-float"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-[#FBC617] to-[#f0a500] flex items-center justify-center shadow-md">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#0a0a0a]">
                      Secure
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium">
                      Safe Payment
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Dots */}
              <div className="absolute -top-8 -right-8 grid grid-cols-4 gap-2 opacity-40">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-[#1E7F57]"
                  />
                ))}
              </div>

              {/* Decorative Circle Pattern */}
              <div className="absolute -bottom-6 -left-6 h-20 w-20 border-4 border-[#FBC617]/40 rounded-full" />
              <div className="absolute -bottom-2 -left-2 h-12 w-12 bg-[#FBC617]/20 rounded-full" />
            </div>

            {/* Slide Navigation Thumbnails */}
            {slides.length > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className="group relative"
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        safeIndex === idx
                          ? "w-12 bg-[#0a0a0a]"
                          : "w-6 bg-gray-200 group-hover:bg-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}