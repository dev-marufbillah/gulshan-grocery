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
      const scrollAmount = direction === "left" ? -350 : 350;
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
        <div className="grid grid-cols-3 gap-x-4 gap-y-7 sm:hidden">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id || cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group/item flex flex-col items-center text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F4F4F4] transition-colors duration-300 group-active/item:bg-[#E8F3EE] group-hover/item:bg-[#E8F3EE]">
                {cat.icon && cat.icon.length > 5 ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    className="h-11 w-11 object-contain"
                  />
                ) : (
                  <span className="text-3xl">{cat.icon || "🛒"}</span>
                )}
              </div>
              <h3 className="mt-2.5 text-xs font-bold leading-tight text-[#1a1a1a] group-hover/item:text-[#1E7F57]">
                {cat.name}
              </h3>
              <p className="mt-0.5 text-[10px] text-[#8c8c8c]">
                {cat.count ?? 0} Products
              </p>
            </Link>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            ট্যাবলেট + ডেস্কটপ: Horizontal Carousel (হুবহু আগেরটি)
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
            className="flex items-center gap-6 md:gap-10 lg:gap-12 overflow-x-auto py-4 px-1 scroll-smooth [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayCategories.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="group/item flex flex-col items-center shrink-0 text-center transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex h-28 w-28 md:h-36 md:w-36 lg:h-40 lg:w-40 items-center justify-center rounded-full bg-[#F4F4F4] transition-colors duration-300 group-hover/item:bg-[#E8F3EE]">
                  {cat.icon && cat.icon.length > 5 ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      className="h-16 w-16 md:h-24 md:w-24 lg:h-28 lg:w-28 object-contain transition-transform duration-300 group-hover/item:scale-110"
                    />
                  ) : (
                    <span className="text-5xl md:text-6xl lg:text-7xl transition-transform duration-300 group-hover/item:scale-110">
                      {cat.icon || "🛒"}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 md:mt-4 text-sm md:text-base lg:text-lg font-bold text-[#1a1a1a] transition-colors group-hover/item:text-[#1E7F57]">
                  {cat.name}
                </h3>
                <p className="mt-0.5 md:mt-1 text-[11px] md:text-sm text-[#8c8c8c]">
                  {cat.count ?? 0} Products
                </p>
              </Link>
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