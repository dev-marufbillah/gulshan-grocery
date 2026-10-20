"use client";

import Link from "next/link";
import { Heart, Star, ShoppingBag, Check } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

export type ProductItem = {
  id?: string;
  _id?: string;
  slug?: string;
  name: string;
  categoryName?: string;
  category?: string;
  weight?: string;
  unit?: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  image?: string;
  emoji?: string;
  stock?: number;
};

const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function ProductCard({ product }: { product: ProductItem }) {
  const hydrated = useHydrated();
  const addItem = useCartStore((s) => s.addItem);

  const wishlistItems = useWishlistStore((s) => s.items);
  const addWishlistItem = useWishlistStore((s) => s.addItem);
  const removeWishlistItem = useWishlistStore((s) => s.removeItem);

  const [added, setAdded] = useState(false);

  const productId =
    product._id ||
    product.id ||
    product.slug ||
    "";
  const categoryDisplayName =
    product.categoryName || product.category || "Grocery";
  const weightDisplayName = product.unit || product.weight || "500 g";
  const productSlug = product.slug || productId;

  const isInWishlist = hydrated
    ? wishlistItems.some((item) => item.id === productId)
    : false;

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId) return;

    addItem({
      _id: productId,
      id: productId,
      name: product.name,
      price: Number(product.price) || 0,
      oldPrice: product.oldPrice,
      image: product.image || "",
      unit: weightDisplayName,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWish = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId) return;

    if (isInWishlist) {
      removeWishlistItem(productId);
    } else {
      addWishlistItem({
        id: productId,
        name: product.name,
        price: product.price,
        weight: weightDisplayName,
        slug: productSlug,
        emoji: product.emoji || "🛒",
      });
    }
  };

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#ececec] bg-white p-2.5 sm:p-4 transition-all duration-300 hover:border-[#1E7F57] hover:shadow-xl">
      {/* 1. Top Badges */}
      <div className="flex items-center justify-between z-10">
        {discount > 0 ? (
          <span className="rounded-lg bg-[#1E7F57] px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white">
            {discount}% off
          </span>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={handleWish}
          className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#f0f0f0] shadow-xs transition-all ${
            isInWishlist
              ? "bg-[#1E7F57] text-white border-[#1E7F57]"
              : "bg-white text-[#6b6b6b] hover:bg-[#1E7F57] hover:text-white"
          }`}
          aria-label="Wishlist"
        >
          <Heart size={14} className="sm:w-4 sm:h-4" fill={isInWishlist ? "currentColor" : "none"} />
        </button>
      </div>

      {/* 2. Image Container */}
      <Link
        href={`/product/${productSlug}`}
        className="my-1 sm:my-2 flex h-28 sm:h-44 w-full items-center justify-center bg-white p-1 sm:p-2 transition-transform duration-300 group-hover:scale-105 relative"
      >
        {product.image && product.image.length > 5 ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-4xl sm:text-7xl">{product.emoji || "🛒"}</span>
        )}
      </Link>

      {/* 3. Product Info */}
      <div className="mt-1">
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold">
          <span className="text-[#1E7F57] truncate max-w-20 sm:max-w-30">{categoryDisplayName}</span>
          <span className="flex items-center font-bold text-[#1a1a1a]">
            <Star size={12} fill="#FBC617" className="mr-0.5 text-[#FBC617] sm:w-3.5 sm:h-3.5" />
            {product.rating ? product.rating.toFixed(1) : "4.8"}
          </span>
        </div>

        <Link href={`/product/${productSlug}`}>
          <h3 className="mt-1 line-clamp-2 sm:line-clamp-1 text-xs sm:text-base font-bold text-[#1a1a1a] transition-colors group-hover:text-[#1E7F57] min-h-8 sm:min-h-0">
            {product.name}
          </h3>
        </Link>

        <p className="mt-0.5 text-[10px] sm:text-xs text-[#8c8c8c]">{weightDisplayName}</p>

        <div className="mt-2 sm:mt-3 flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1 sm:gap-1.5">
            <span className="text-sm sm:text-lg font-bold text-[#1a1a1a]">৳{product.price}</span>
            {product.oldPrice && product.oldPrice > product.price ? (
              <span className="text-[10px] sm:text-xs text-[#9a9a9a] line-through">
                ৳{product.oldPrice}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`flex cursor-pointer items-center gap-1 sm:gap-1.5 rounded-full px-2.5 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-bold transition-all ${
              added
                ? "bg-[#1E7F57] text-white"
                : "bg-[#E8F3EE] text-[#1E7F57] hover:bg-[#1E7F57] hover:text-white"
            }`}
          >
            {added ? (
              <>
                <Check size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={12} className="sm:w-3.5 sm:h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}