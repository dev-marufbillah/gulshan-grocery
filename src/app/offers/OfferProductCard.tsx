"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/store/cart";

export type OfferProduct = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  weight?: string | null;
  image?: string | null;
};

export default function OfferProductCard({ p }: { p: OfferProduct }) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const discount =
    p.oldPrice && p.oldPrice > p.price
      ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 🛒 Cart store call (oldPrice বাদ দেওয়া হয়েছে টাইপ এরর দূর করতে)
    addItem({
      id: p._id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      image: p.image ?? undefined,
      weight: p.weight ?? undefined,
      qty: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-xs transition hover:shadow-md">
      {/* Discount Badge */}
      {discount && (
        <span className="absolute left-3 top-3 z-10 rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
          {discount}% OFF
        </span>
      )}

      {/* Image Link */}
      <Link href={`/product/${p.slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
          {p.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={p.image}
              alt={p.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-300">
              No Image
            </div>
          )}
        </div>

        <div className="mt-3">
          <h3 className="line-clamp-1 text-xs font-bold text-gray-800 sm:text-sm">
            {p.name}
          </h3>
          {p.weight && (
            <p className="mt-0.5 text-[10px] text-gray-400">{p.weight}</p>
          )}
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-sm font-extrabold text-[#1E7F57] sm:text-base">
              ৳{p.price}
            </span>
            {p.oldPrice && p.oldPrice > p.price && (
              <span className="text-xs text-gray-400 line-through">
                ৳{p.oldPrice}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add To Cart Button */}
      <button
        type="button"
        onClick={handleAddToCart}
        className={`mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
          added
            ? "bg-[#1a1a1a] text-white"
            : "bg-[#E8F3EE] text-[#1E7F57] hover:bg-[#1E7F57] hover:text-white"
        }`}
      >
        {added ? (
          <>
            <Check size={14} /> Added!
          </>
        ) : (
          <>
            <ShoppingBag size={14} /> Add to Cart
          </>
        )}
      </button>
    </div>
  );
}