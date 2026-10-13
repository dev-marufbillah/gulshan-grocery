"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Kristin Watson",
    role: "Chef",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5.0,
    quote: "Gulshan Grocery has completely transformed how I shop for my kitchen. The fruits and vegetables are extraordinarily fresh, and delivery is always right on time!",
  },
  {
    id: 2,
    name: "Bessie Cooper",
    role: "Housewife",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    rating: 5.0,
    quote: "I've tried several grocery delivery services, and this one is by far the best. The website is user-friendly, the selection is vast, and the customer service is outstanding. Highly recommend!",
  },
  {
    id: 3,
    name: "Jane Cooper",
    role: "Nutritionist",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    rating: 5.0,
    quote: "As a nutritionist, I care deeply about organic and preservative-free food. Gulshan Grocery delivers peak quality produce every single time without fail.",
  },
  {
    id: 4,
    name: "Robert Fox",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5.0,
    quote: "Ordering groceries takes less than 2 minutes now. The live order tracking and bKash payment option make it super convenient after a long workday.",
  },
  {
    id: 5,
    name: "Guy Hawkins",
    role: "Restaurant Owner",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5.0,
    quote: "Reliable bulk supplies for my restaurant in Gulshan. The prices are competitive, items are packaged cleanly, and their support team responds instantly.",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(1); // Default active: Bessie Cooper (Middle)

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const activeItem = TESTIMONIALS[activeIndex];

  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center">
          <p className="text-sm font-semibold text-[#6b6b6b]">Testimonials</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl md:text-5xl">
            Testimonials from <span className="text-[#1E7F57]">Our Loyal Customers</span>
          </h2>
        </div>

        {/* Avatars Row */}
        <div className="mt-12 flex items-center justify-center gap-3 sm:gap-5">
          {TESTIMONIALS.map((t, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative overflow-hidden rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "h-16 w-16 sm:h-20 sm:w-20 ring-4 ring-[#FBC617] scale-110 shadow-md"
                    : "h-12 w-12 sm:h-14 sm:w-14 opacity-50 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>

        {/* Quote & Navigation Controls */}
        <div className="mt-10 flex items-center justify-between gap-4 md:gap-8 max-w-4xl mx-auto">
          {/* Left Dark Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-white shadow-md transition hover:bg-[#1E7F57] cursor-pointer"
            aria-label="Previous Testimonial"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Testimonial Quote */}
          <div className="relative text-center px-4 flex-1">
            <Quote size={56} className="absolute -top-8 left-1/2 -translate-x-1/2 text-[#F4F4F4] -z-10 pointer-events-none" />
            <p className="text-base leading-relaxed text-[#4b4b4b] sm:text-lg md:text-xl font-medium transition-all duration-300 min-h-[90px] flex items-center justify-center">
              &ldquo;{activeItem.quote}&rdquo;
            </p>
          </div>

          {/* Right Green Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1E7F57] text-white shadow-md transition hover:bg-[#166b48] cursor-pointer"
            aria-label="Next Testimonial"
          >
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Rating Stars & Author Info */}
        <div className="mt-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={18} fill="#FBC617" className="text-[#FBC617]" />
              ))}
            </div>
            <span className="font-bold text-[#1a1a1a] text-sm">
              {activeItem.rating.toFixed(1)}
            </span>
          </div>

          <h3 className="mt-3 text-base font-bold text-[#1a1a1a]">{activeItem.name}</h3>
          <p className="text-xs font-medium text-[#8c8c8c]">{activeItem.role}</p>
        </div>

      </div>
    </section>
  );
}