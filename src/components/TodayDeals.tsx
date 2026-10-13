"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Star, ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

// 🌟 Summer Discount Countdown Timer Target
const TARGET_DATE = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).getTime();

export default function TodayDeals() {
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 14,
    minutes: 48,
    seconds: 18,
  });

  const addItem = useCartStore((s) => s.addItem);
  const addWish = useWishlistStore((s) => s.addItem);
  const removeWish = useWishlistStore((s) => s.removeItem);

  const [added1, setAdded1] = useState(false);
  const [added2, setAdded2] = useState(false);

  // Live Timer Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Today Deals Sample Products
  const deal1 = {
    id: "deal-1",
    slug: "laundry-detergent",
    name: "Laundry Detergent",
    categoryName: "Laundry Supplies",
    weight: "2 L",
    price: 750,
    oldPrice: 1000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1585830812416-a6c86bb14576?auto=format&fit=crop&w=600&q=80",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    discount: 25,
  };

  const deal2 = {
    id: "deal-2",
    slug: "body-wash",
    name: "Body Wash",
    categoryName: "Personal Care",
    weight: "500 ml",
    price: 250,
    oldPrice: 500,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    discount: 50,
  };

  const isWish1 = useWishlistStore((s) => s.isInWishlist(deal1.id));
  const isWish2 = useWishlistStore((s) => s.isInWishlist(deal2.id));

  const handleAdd1 = () => {
    addItem({ id: deal1.id, slug: deal1.slug, name: deal1.name, price: deal1.price, emoji: "🧴", weight: deal1.weight, qty: 1 });
    setAdded1(true);
    setTimeout(() => setAdded1(false), 1500);
  };

  const handleAdd2 = () => {
    addItem({ id: deal2.id, slug: deal2.slug, name: deal2.name, price: deal2.price, emoji: "🧴", weight: deal2.weight, qty: 1 });
    setAdded2(true);
    setTimeout(() => setAdded2(false), 1500);
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl space-y-16 px-4 md:px-6">
        
        {/* ================= 1. TOP 3-CARD BANNER WITH TIMER ================= */}
        <div className="grid gap-6 lg:grid-cols-[1fr_2.2fr_1fr]">
          
          {/* Left Tall Image Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-[#e5e5e5] bg-[#F9F9F9] min-h-[380px] group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
              alt="Grocery Shopping"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-3 rounded-2xl border-2 border-white/60 pointer-events-none" />
          </div>

          {/* Center Countdown Discount Banner */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-[#e5e5e5] bg-[#FDFBF7] p-8 text-center shadow-xs">
            {/* Background Decorative Fruit Images in corners */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=300&q=80"
              alt="Grapefruit"
              className="absolute left-[-20px] top-[-20px] h-32 w-32 object-contain opacity-80 pointer-events-none"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=300&q=80"
              alt="Apple"
              className="absolute right-[-20px] bottom-[-20px] h-36 w-36 object-contain opacity-80 pointer-events-none"
            />

            {/* Content */}
            <h3 className="text-2xl font-bold text-[#1a1a1a] sm:text-3xl">
              Summer <span className="text-[#1E7F57]">Discount</span>
            </h3>
            <p className="mt-2 text-sm text-[#6b6b6b]">
              Get 50% off - Limited Time Offer!
            </p>

            {/* Timer Blocks */}
            <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
              <div className="text-center">
                <span className="block text-2xl font-bold text-[#1a1a1a] sm:text-3xl">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-xs text-[#8c8c8c]">Days</span>
              </div>
              <span className="text-xl font-bold text-[#1a1a1a] mb-4">:</span>

              <div className="text-center">
                <span className="block text-2xl font-bold text-[#1a1a1a] sm:text-3xl">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-xs text-[#8c8c8c]">Hours</span>
              </div>
              <span className="text-xl font-bold text-[#1a1a1a] mb-4">:</span>

              <div className="text-center">
                <span className="block text-2xl font-bold text-[#1a1a1a] sm:text-3xl">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-xs text-[#8c8c8c]">Minutes</span>
              </div>
              <span className="text-xl font-bold text-[#1a1a1a] mb-4">:</span>

              <div className="text-center">
                <span className="block text-2xl font-bold text-[#1a1a1a] sm:text-3xl">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-xs text-[#8c8c8c]">Secounds</span>
              </div>
            </div>

            {/* Button */}
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1E7F57] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#166b48]"
            >
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right Tall Image Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-[#e5e5e5] bg-[#F9F9F9] min-h-[380px] group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80"
              alt="Grocery Girl"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-3 rounded-2xl border-2 border-white/60 pointer-events-none" />
          </div>

        </div>

        {/* ================= 2. DEALS OF THE DAY SECTION ================= */}
        <div>
          {/* Header */}
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <p className="text-sm font-semibold text-[#6b6b6b]">Today Deals</p>
              <h2 className="text-3xl font-bold text-[#1a1a1a] md:text-4xl">
                <span className="text-[#1E7F57]">Deals</span> of the Day
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-[#8c8c8c]">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam
            </p>
          </div>

          {/* 2 Horizontal Deal Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Deal Card 1 */}
            <div className="flex flex-col sm:flex-row items-center rounded-3xl border border-[#e5e5e5] bg-white p-4 shadow-xs transition hover:border-[#1E7F57] hover:shadow-md">
              {/* Image Box */}
              <div className="relative flex h-52 w-full sm:w-52 shrink-0 items-center justify-center rounded-2xl bg-[#F4F4F4] p-4">
                <span className="absolute left-3 top-3 rounded-md bg-[#1E7F57] px-2 py-0.5 text-xs font-bold text-white">
                  {deal1.discount}% off
                </span>
                <button
                  onClick={() => isWish1 ? removeWish(deal1.id) : addWish({ id: deal1.id, slug: deal1.slug, name: deal1.name, price: deal1.price, emoji: "🧴", weight: deal1.weight })}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#6b6b6b] border border-[#e5e5e5] hover:text-[#1E7F57]"
                >
                  <Heart size={16} fill={isWish1 ? "#1E7F57" : "none"} />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={deal1.image} alt={deal1.name} className="h-full w-full object-contain" />
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col justify-between h-full w-full">
                <div>
                  <p className="text-xs font-semibold text-[#1E7F57]">{deal1.categoryName}</p>
                  <Link href={`/shop/${deal1.slug}`}>
                    <h3 className="mt-1 text-lg font-bold text-[#1a1a1a] hover:text-[#1E7F57] transition">{deal1.name}</h3>
                  </Link>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[#1a1a1a]">৳{deal1.price}</span>
                    <span className="text-xs text-[#9a9a9a] line-through">৳{deal1.oldPrice}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#1a1a1a]">
                    <Star size={14} fill="#FBC617" className="text-[#FBC617]" />
                    {deal1.rating.toFixed(1)}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#8c8c8c] line-clamp-2">
                    {deal1.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-[#f0f0f0]">
                  <button
                    onClick={handleAdd1}
                    className="flex items-center gap-1.5 rounded-full bg-[#E8F3EE] px-4 py-2 text-xs font-bold text-[#1E7F57] hover:bg-[#1E7F57] hover:text-white transition"
                  >
                    {added1 ? <><Check size={14} /> Added</> : <><ShoppingBag size={14} /> Add</>}
                  </button>
                </div>
              </div>
            </div>

            {/* Deal Card 2 */}
            <div className="flex flex-col sm:flex-row items-center rounded-3xl border border-[#e5e5e5] bg-white p-4 shadow-xs transition hover:border-[#1E7F57] hover:shadow-md">
              {/* Image Box */}
              <div className="relative flex h-52 w-full sm:w-52 shrink-0 items-center justify-center rounded-2xl bg-[#F4F4F4] p-4">
                <span className="absolute left-3 top-3 rounded-md bg-[#1E7F57] px-2 py-0.5 text-xs font-bold text-white">
                  {deal2.discount}% off
                </span>
                <button
                  onClick={() => isWish2 ? removeWish(deal2.id) : addWish({ id: deal2.id, slug: deal2.slug, name: deal2.name, price: deal2.price, emoji: "🧴", weight: deal2.weight })}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#6b6b6b] border border-[#e5e5e5] hover:text-[#1E7F57]"
                >
                  <Heart size={16} fill={isWish2 ? "#1E7F57" : "none"} />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={deal2.image} alt={deal2.name} className="h-full w-full object-contain" />
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col justify-between h-full w-full">
                <div>
                  <p className="text-xs font-semibold text-[#1E7F57]">{deal2.categoryName}</p>
                  <Link href={`/shop/${deal2.slug}`}>
                    <h3 className="mt-1 text-lg font-bold text-[#1a1a1a] hover:text-[#1E7F57] transition">{deal2.name}</h3>
                  </Link>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[#1a1a1a]">৳{deal2.price}</span>
                    <span className="text-xs text-[#9a9a9a] line-through">৳{deal2.oldPrice}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#1a1a1a]">
                    <Star size={14} fill="#FBC617" className="text-[#FBC617]" />
                    {deal2.rating.toFixed(1)}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#8c8c8c] line-clamp-2">
                    {deal2.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-[#f0f0f0]">
                  <button
                    onClick={handleAdd2}
                    className="flex items-center gap-1.5 rounded-full bg-[#E8F3EE] px-4 py-2 text-xs font-bold text-[#1E7F57] hover:bg-[#1E7F57] hover:text-white transition"
                  >
                    {added2 ? <><Check size={14} /> Added</> : <><ShoppingBag size={14} /> Add</>}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ================= 3. WEEKLY DEALS GREEN BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-[#1E7F57] p-8 md:p-12 text-white shadow-lg">
          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FBC617]">
              Weekly Deals
            </span>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-white md:text-4xl">
              Unbeatable Offers: Your <br />
              <span className="text-[#FBC617]">Weekly Grocery Specials</span>
            </h2>
            <p className="mt-4 text-xs leading-relaxed text-white/80 md:text-sm">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FBC617] px-8 py-3 text-sm font-bold text-[#1a1a1a] transition hover:bg-yellow-400"
            >
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right Basket Image */}
          <div className="absolute right-0 bottom-0 top-0 z-0 hidden w-[45%] md:flex items-center justify-end pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
              alt="Grocery Basket"
              className="h-full w-full object-cover object-left rounded-l-full opacity-90"
            />
          </div>
        </div>

      </div>
    </section>
  );
}