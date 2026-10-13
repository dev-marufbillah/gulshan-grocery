"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBasket, ShieldCheck, Truck } from "lucide-react";

type SlideItem = {
  badge: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  image: string;
};

const DEFAULT_SLIDES: SlideItem[] = [
  {
    badge: "The Best Online Grocery Store",
    titlePart1: "Your One-Stop Shop for ",
    titlePart2: "Quality Groceries",
    description:
      "Get fresh fruits, vegetables, and daily essentials delivered to your doorstep in Gulshan, Dhaka.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    badge: "Farm Fresh Everyday",
    titlePart1: "Organic & Healthy ",
    titlePart2: "Fresh Produce",
    description:
      "We source the best organic foods directly from farmers so your family eats fresh and healthy.",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    badge: "Fast & Secure Delivery",
    titlePart1: "Stock Up Your Pantry ",
    titlePart2: "In Minutes",
    description:
      "Order all your bakery and household essentials online. We deliver fast so you can save time.",
    image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=1200&q=80",
  },
];

type HeroProps = {
  avgRating: number;
  customerCount: string;
  customSlides?: SlideItem[] | null;
};

export default function Hero({
  avgRating,
  customerCount,
  customSlides,
}: HeroProps) {
  const slides = customSlides || DEFAULT_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full overflow-hidden bg-[#F9F9F9] pb-16 pt-10 lg:py-20">
      {/* Background Pattern */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(#d9d9d9 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* LEFT: Text Content */}
          <div className="flex flex-col items-start max-lg:items-center max-lg:text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex animate-in fade-in slide-in-from-bottom-2 items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-4 py-2 shadow-sm transition-all">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E8F3EE] text-[#1E7F57]">
                <ShoppingBasket size={14} />
              </span>
              <span className="text-xs font-semibold text-[#1a1a1a]">
                {slide.badge}
              </span>
            </div>

            {/* Title */}
            <h1
              key={`title-${currentSlide}`}
              className="animate-in fade-in slide-in-from-bottom-4 text-4xl font-bold leading-[1.15] tracking-tight text-[#1a1a1a] duration-500 sm:text-5xl lg:text-[64px]"
            >
              {slide.titlePart1}
              <span className="text-[#1E7F57]">{slide.titlePart2}</span>
            </h1>

            {/* Description */}
            <p
              key={`desc-${currentSlide}`}
              className="animate-in fade-in slide-in-from-bottom-5 mt-6 max-w-lg text-base leading-relaxed text-[#6b6b6b] duration-700"
            >
              {slide.description}
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                href="/shop"
                className="group flex h-14 items-center justify-center gap-2 rounded-full bg-[#1E7F57] px-8 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#166b48] hover:shadow-xl"
              >
                Shop Now
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/shop"
                className="text-sm font-semibold text-[#1a1a1a] underline underline-offset-4 transition hover:text-[#1E7F57]"
              >
                View All Products
              </Link>
            </div>

            {/* Ratings & Trust */}
            <div className="mt-12 flex items-center gap-4 border-t border-[#e5e5e5] pt-6">
              <div className="flex -space-x-3">
                {["👩", "👨", "👩", "🧑"].map((emoji, i) => (
                  <div
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#F4F4F4] text-lg shadow-sm"
                  >
                    {emoji}
                  </div>
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#FBC617] text-sm font-bold text-[#1a1a1a] shadow-sm">
                  +
                </div>
              </div>
              <div className="text-left">
                <p className="font-bold text-[#1a1a1a]">{avgRating} Ratings+</p>
                <p className="text-xs text-[#6b6b6b]">
                  Trusted by {customerCount}+ Customers
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Image Slider */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-2xl lg:aspect-[5/4] lg:rounded-[3rem]">
              {slides.map((s, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    currentSlide === i ? "z-10 opacity-100" : "z-0 opacity-0"
                  }`}
                >
                  {/* Real Image Render (Universal Image Compatibility) */}
                  {s.image && s.image.length > 5 ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={s.image}
                      alt="Grocery Delivery"
                      className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${
                        currentSlide === i ? "scale-100" : "scale-110"
                      }`}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <span className="text-4xl text-gray-400">No Image</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              ))}
            </div>

            <div
              className="absolute -left-4 bottom-10 z-20 flex animate-bounce items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-xl lg:-left-8 lg:bottom-16"
              style={{ animationDuration: "3s" }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3EE] text-[#1E7F57]">
                <Truck size={18} />
              </span>
              <span className="text-sm font-bold text-[#1a1a1a]">
                Fast Delivery
              </span>
            </div>

            <div
              className="absolute -right-4 top-10 z-20 flex animate-bounce items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-xl lg:-right-8 lg:top-16"
              style={{ animationDuration: "4s" }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3EE] text-[#1E7F57]">
                <ShieldCheck size={18} />
              </span>
              <span className="text-sm font-bold text-[#1a1a1a]">
                Secure Payment
              </span>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="mt-12 flex items-center justify-center gap-2 lg:justify-end">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? "w-8 bg-[#1E7F57]"
                  : "w-2.5 bg-[#e5e5e5] hover:bg-[#1E7F57]/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}