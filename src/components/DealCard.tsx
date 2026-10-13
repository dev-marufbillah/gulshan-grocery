"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Check } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

export type DealItem = {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  weight?: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  image?: string;
  emoji?: string;
  description?: string;
  discount?: number;
};

export default function DealCard({ product }: { product: DealItem }) {
  const addItem = useCartStore((s) => s.addItem);
  const addWish = useWishlistStore((s) => s.addItem);
  const removeWish = useWishlistStore((s) => s.removeItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));

  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      emoji: product.emoji || "🛒",
      image: product.image || "",
      weight: product.weight || "500 g",
      qty: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWish = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      removeWish(product.id);
    } else {
      addWish({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        emoji: product.emoji || "🛒",
        weight: product.weight || "500 g",
      });
    }
  };

  const discount =
    product.discount ||
    (product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 20);

  return (
    <div className="group flex flex-col sm:flex-row items-center rounded-3xl border border-[#e5e5e5] bg-white p-4 shadow-xs transition hover:border-[#1E7F57] hover:shadow-md">
      <div className="relative flex h-52 w-full sm:w-52 shrink-0 items-center justify-center rounded-2xl bg-[#F4F4F4] p-4">
        <span className="absolute left-3 top-3 rounded-md bg-[#1E7F57] px-2 py-0.5 text-xs font-bold text-white">
          {discount}% off
        </span>
        <button
          type="button"
          onClick={handleWish}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#6b6b6b] border border-[#e5e5e5] hover:text-[#1E7F57]"
        >
          <Heart size={16} fill={isInWishlist ? "#1E7F57" : "none"} />
        </button>
        {product.image && product.image.length > 5 ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
        ) : (
          <span className="text-6xl">{product.emoji || "🛒"}</span>
        )}
      </div>

      <div className="p-4 flex flex-col justify-between h-full w-full">
        <div>
          <p className="text-xs font-semibold text-[#1E7F57]">{product.categoryName}</p>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="mt-1 text-lg font-bold text-[#1a1a1a] hover:text-[#1E7F57] transition">{product.name}</h3>
          </Link>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#1a1a1a]">৳{product.price}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-[#9a9a9a] line-through">৳{product.oldPrice}</span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#1a1a1a]">
            <Star size={14} fill="#FBC617" className="text-[#FBC617]" />
            {product.rating ? product.rating.toFixed(1) : "5.0"}
          </div>
          {product.description && (
            <p className="mt-2 text-xs leading-relaxed text-[#8c8c8c] line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-4 pt-2 border-t border-[#f0f0f0]">
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 rounded-full bg-[#E8F3EE] px-4 py-2 text-xs font-bold text-[#1E7F57] hover:bg-[#1E7F57] hover:text-white transition"
          >
            {added ? <><Check size={14} /> Added</> : <><ShoppingBag size={14} /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}