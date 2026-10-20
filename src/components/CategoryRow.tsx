"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  count?: number;
};

const DEMO_CATEGORIES: CategoryItem[] = [
  { id: "1", name: "Vegetables", slug: "vegetables", icon: "🥦", count: 52 },
  { id: "2", name: "Fresh Fruits", slug: "fresh-fruits", icon: "🍎", count: 48 },
  { id: "3", name: "Milk & Eggs", slug: "milk-eggs", icon: "🥛", count: 12 },
  { id: "4", name: "Bakery", slug: "bakery", icon: "🥐", count: 62 },
  { id: "5", name: "House Hold", slug: "house-hold", icon: "🧴", count: 25 },
  { id: "6", name: "Dry Fruits", slug: "dry-fruits", icon: "🌰", count: 8 },
  { id: "7", name: "Drinks", slug: "drinks", icon: "🍹", count: 20 },
  { id: "8", name: "Meat & Fish", slug: "meat-fish", icon: "🐟", count: 34 },
];

// ছবির URL নাকি ইমোজি — সেটা ঠিকভাবে আলাদা করার জন্য
function isImageUrl(value?: string) {
  if (!value) return false;
  const v = value.trim();
  return (
    v.startsWith("http://") ||
    v.startsWith("https://") ||
    v.startsWith("/") ||
    v.startsWith("data:image")
  );
}

// ══════════════════════════════════════════
// একটি ক্যাটেগরি কার্ড (মোবাইল + ডেস্কটপ দুই জায়গাতেই ব্যবহার হয়)
// ছবি বা ইমোজি — দুটোই একই সুন্দর স্কোয়ার ফ্রেমের ভেতরে বসে
// ══════════════════════════════════════════
function CategoryCard({ cat }: { cat: CategoryItem }) {
  return (
    <Link
      href={`/shop?category=${cat.slug}`}
      className="group/item flex h-full flex-col rounded-2xl border border-[#ececec] bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#1E7F57]/40 hover:shadow-[0_12px_28px_-8px_rgba(30,127,87,0.25)] active:scale-[0.98] sm:p-3"
    >
      {/* Image / Emoji Frame */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F1F7F4] transition-colors duration-300 group-hover/item:bg-[#E8F3EE]">
        {isImageUrl(cat.icon) ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={cat.icon}
            alt={cat.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-110"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-4xl transition-transform duration-500 group-hover/item:scale-110 sm:text-6xl">
            {cat.icon || "🛒"}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col items-center px-1 pb-1 pt-2.5 text-center sm:pt-3.5">
        <h3 className="line-clamp-1 text-[11px] font-bold text-[#1a1a1a] transition-colors group-hover/item:text-[#1E7F57] sm:text-base">
          {cat.name}
        </h3>
        <span className="mt-1.5 rounded-full bg-[#E8F3EE] px-2 py-0.5 text-[9px] font-semibold text-[#1E7F57] sm:px-3 sm:py-1 sm:text-xs">
          {cat.count ?? 0} Products
        </span>
      </div>
    </Link>
  );
}

export default function CategoryRow({
  categories,
}: {
  categories?: CategoryItem[];
}) {
  const displayCategories =
    categories && categories.length > 0 ? categories : DEMO_CATEGORIES;

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("category-scroll-container");
    if (container) {
      const scrollAmount = direction === "left" ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white py-10 sm:py-14 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-center relative">
          <p className="text-xs sm:text-sm font-medium tracking-wide text-[#6b6b6b]">
            Categories
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1a1a1a] sm:text-3xl md:text-4xl lg:text-5xl">
            Featured <span className="text-[#1E7F57]">Categories</span>
          </h2>

          {/* See All */}
          <Link
            href="/shop"
            className="mt-3 inline-block text-xs sm:text-sm font-semibold text-[#1E7F57] hover:underline sm:mt-4"
          >
            See All →
          </Link>
        </div>

        {/* ══════════════════════════════════════════
            মোবাইল: Grid (৩ কলাম) — প্রতি লাইনে ৩টি
           ══════════════════════════════════════════ */}
        <div className="grid grid-cols-3 gap-2.5 sm:hidden">
          {displayCategories.map((cat) => (
            <CategoryCard key={cat.id || cat.slug} cat={cat} />
          ))}
        </div>

        {/* ══════════════════════════════════════════
            ট্যাবলেট + ডেস্কটপ: Horizontal Carousel
           ══════════════════════════════════════════ */}
        <div className="relative group hidden sm:block">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="absolute -left-3 lg:-left-5 top-1/2 z-20 hidden md:flex h-10 w-10 lg:h-11 lg:w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a1a1a] shadow-lg border border-[#e5e5e5] transition hover:bg-[#1E7F57] hover:text-white cursor-pointer"
            aria-label="Previous Categories"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            id="category-scroll-container"
            className="flex items-stretch gap-4 md:gap-5 lg:gap-6 overflow-x-auto px-2 py-6 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayCategories.map((cat) => (
              <div
                key={cat.id || cat.slug}
                className="w-40 shrink-0 snap-start md:w-44 lg:w-48"
              >
                <CategoryCard cat={cat} />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="absolute -right-3 lg:-right-5 top-1/2 z-20 hidden md:flex h-10 w-10 lg:h-11 lg:w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a1a1a] shadow-lg border border-[#e5e5e5] transition hover:bg-[#1E7F57] hover:text-white cursor-pointer"
            aria-label="Next Categories"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* মোবাইলে নিচে See All বাটন */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/shop"
            className="flex h-11 w-full max-w-xs items-center justify-center rounded-full border border-[#1E7F57] text-sm font-semibold text-[#1E7F57] transition hover:bg-[#1E7F57] hover:text-white"
          >
            See All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}