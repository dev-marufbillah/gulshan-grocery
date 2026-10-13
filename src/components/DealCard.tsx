"use client";

import { useState } from "react";
import { Heart, ShoppingBag, Star, Check } from "lucide-react";
import { useCart } from "@/store/cart";

export type DealItem = {
  id: string;
  name: string;
  categoryName: string;
  weight: string;
  description: string;
  price: number;
  oldPrice: number;
  rating: number;
  image: string;
  emoji: string;
};

function isImage(src: string) {
  return src.startsWith("/") || src.startsWith("http");
}

export default function DealCard({ deal }: { deal: DealItem }) {
  const addItem = useCart((s) => s.addItem);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const discount =
    deal.oldPrice > deal.price
      ? Math.round((1 - deal.price / deal.oldPrice) * 100)
      : 0;

  const handleAdd = () => {
    addItem({
      id: deal.id,
      name: deal.name,
      price: deal.price,
      weight: deal.weight,
      image: deal.image,
      emoji: deal.emoji,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#ececec] bg-white p-3 sm:flex-row">
      {/* Image panel */}
      <div className="relative flex h-[220px] items-center justify-center rounded-lg bg-[#F4F4F4] sm:h-auto sm:w-[44%]">
        {discount > 0 && (
          <span className="absolute left-0 top-3 rounded-r-full bg-[#1E7F57] px-3 py-1 text-sm font-medium text-white">
            {discount}% off
          </span>
        )}
        {isImage(deal.image) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={deal.image}
            alt={deal.name}
            className="h-[85%] w-auto object-contain"
          />
        ) : (
          <span className="text-[100px] drop-shadow-md">{deal.emoji}</span>
        )}
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col justify-center py-2 pr-2">
        <button
          onClick={() => setLiked((v) => !v)}
          aria-label="Add to wishlist"
          className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[#ececec] transition hover:scale-105"
        >
          <Heart
            size={18}
            className={liked ? "text-red-500" : "text-[#1a1a1a]"}
            fill={liked ? "#ef4444" : "none"}
          />
        </button>

        <span className="text-sm text-[#1E7F57]">{deal.categoryName}</span>
        <h3 className="mt-1 text-lg font-semibold text-[#1a1a1a]">
          {deal.name}
        </h3>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-[#1a1a1a]">
            ৳{deal.price}
          </span>
          {deal.oldPrice > deal.price && (
            <span className="text-sm text-[#9b9b9b] line-through">
              ৳{deal.oldPrice}
            </span>
          )}
        </div>

        <span className="mt-2 flex items-center gap-1 text-sm font-semibold text-[#1a1a1a]">
          <Star size={16} className="text-[#FBC617]" fill="#FBC617" />
          {deal.rating.toFixed(1)}
        </span>

        <p className="mt-3 text-sm leading-6 text-[#6b6b6b]">
          {deal.description}
        </p>

        <button
          onClick={handleAdd}
          className={`mt-4 flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
            added
              ? "bg-[#1E7F57] text-white"
              : "bg-[#E3F1EA] text-[#1E7F57] hover:bg-[#1E7F57] hover:text-white"
          }`}
        >
          {added ? <Check size={16} /> : <ShoppingBag size={16} />}
          {added ? "Added" : "Add"}
        </button>
      </div>
    </div>
  );
}