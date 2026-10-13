"use client";

import Link from "next/link";
import { Heart, Star, ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

export type ProductItem = {
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
  stock?: number;
};

export default function ProductCard({ product }: { product: ProductItem }) {
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
        stock: product.stock ?? 100,
      });
    }
  };

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 20;

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-[#ececec] bg-white p-4 transition-all duration-300 hover:border-[#1E7F57] hover:shadow-xl">
      {/* 1. Top Badges: Discount Pill (Left) & Heart Button (Right) */}
      <div className="flex items-center justify-between z-10">
        {discount > 0 ? (
          <span className="rounded-lg bg-[#1E7F57] px-2.5 py-1 text-xs font-bold text-white">
            {discount}% off
          </span>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={handleWish}
          className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#f0f0f0] shadow-xs transition-all ${
            isInWishlist
              ? "bg-[#1E7F57] text-white border-[#1E7F57]"
              : "bg-white text-[#6b6b6b] hover:bg-[#1E7F57] hover:text-white"
          }`}
          aria-label="Wishlist"
        >
          <Heart size={16} fill={isInWishlist ? "currentColor" : "none"} />
        </button>
      </div>

      {/* 2. Seamless Image Container: No Inner Box, Pure White Seamless Fit */}
      <Link
        href={`/shop/${product.slug}`}
        className="my-2 flex h-44 w-full items-center justify-center bg-white p-2 transition-transform duration-300 group-hover:scale-105"
      >
        {product.image && product.image.length > 5 ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-7xl">{product.emoji || "🛒"}</span>
        )}
      </Link>

      {/* 3. Product Info */}
      <div className="mt-1">
        {/* Category & Star Rating */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[#1E7F57]">{product.categoryName}</span>
          <span className="flex items-center font-bold text-[#1a1a1a]">
            <Star size={14} fill="#FBC617" className="mr-1 text-[#FBC617]" />
            {product.rating ? product.rating.toFixed(1) : "4.8"}
          </span>
        </div>

        {/* Title */}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="mt-1.5 line-clamp-1 text-base font-bold text-[#1a1a1a] transition-colors group-hover:text-[#1E7F57]">
            {product.name}
          </h3>
        </Link>

        {/* Weight / Unit */}
        <p className="mt-0.5 text-xs text-[#8c8c8c]">{product.weight || "500 g"}</p>

        {/* Price & Add to Cart Button */}
        <div className="mt-3 flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-[#1a1a1a]">৳{product.price}</span>
            {product.oldPrice && product.oldPrice > product.price ? (
              <span className="text-xs text-[#9a9a9a] line-through">
                ৳{product.oldPrice}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              added
                ? "bg-[#1E7F57] text-white"
                : "bg-[#E8F3EE] text-[#1E7F57] hover:bg-[#1E7F57] hover:text-white"
            }`}
          >
            {added ? (
              <>
                <Check size={14} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={14} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}