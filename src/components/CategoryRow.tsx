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
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Section Header: Centered Subtitle & Main Title */}
        <div className="mb-12 text-center">
          <p className="text-sm font-medium tracking-wide text-[#6b6b6b]">
            Categories
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl md:text-5xl">
            Featured <span className="text-[#1E7F57]">Categories</span>
          </h2>
        </div>

        {/* Carousel / Spacious Row */}
        <div className="relative group">
          
          {/* Left Arrow */}
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="absolute -left-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a1a1a] shadow-lg border border-[#e5e5e5] transition hover:bg-[#1E7F57] hover:text-white max-md:hidden cursor-pointer"
            aria-label="Previous Categories"
          >
            <ChevronLeft size={22} />
          </button>

          {/* 🌟 Scrollable Container with Big Circles & Spacious Gap */}
          <div
            id="category-scroll-container"
            className="flex items-center gap-8 md:gap-12 overflow-x-auto py-4 px-2 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayCategories.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="group/item flex flex-col items-center shrink-0 text-center transition-transform duration-300 hover:-translate-y-1"
              >
                {/* 🌟 BIG CIRCLE ICON FRAME */}
                <div className="flex h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 items-center justify-center rounded-full bg-[#F4F4F4] transition-colors duration-300 group-hover/item:bg-[#E8F3EE]">
                  {cat.icon && cat.icon.length > 5 ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 object-contain transition-transform duration-300 group-hover/item:scale-110"
                    />
                  ) : (
                    <span className="text-5xl sm:text-6xl md:text-7xl transition-transform duration-300 group-hover/item:scale-110">
                      {cat.icon || "🛒"}
                    </span>
                  )}
                </div>

                {/* Category Name */}
                <h3 className="mt-4 text-base font-bold text-[#1a1a1a] transition-colors group-hover/item:text-[#1E7F57] sm:text-lg">
                  {cat.name}
                </h3>

                {/* Product Count */}
                <p className="mt-1 text-xs sm:text-sm text-[#8c8c8c]">
                  {cat.count ?? 0} Products
                </p>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="absolute -right-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a1a1a] shadow-lg border border-[#e5e5e5] transition hover:bg-[#1E7F57] hover:text-white max-md:hidden cursor-pointer"
            aria-label="Next Categories"
          >
            <ChevronRight size={22} />
          </button>
        </div>

      </div>
    </section>
  );
}