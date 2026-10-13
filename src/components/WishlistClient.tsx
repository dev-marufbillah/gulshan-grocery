"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, X, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";

export default function WishlistClient() {
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const addToCart = useCartStore((s) => s.addItem);

  const [copied, setCopied] = useState(false);
  const wishlistLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/wishlist`
      : "https://gulshangrocery.com/wishlist";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wishlistLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const handleAddToCart = (item: (typeof items)[0]) => {
    addToCart({
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: item.price,
      emoji: item.emoji,
      weight: item.weight,
      qty: 1,
    });
  };

  const handleAddAll = () => {
    items.forEach((item) => handleAddToCart(item));
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20 text-center md:px-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#F4F4F4]">
          <Heart size={40} className="text-[#6b6b6b]" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-[#1a1a1a]">
          Your wishlist is empty
        </h2>
        <p className="mt-2 text-[#6b6b6b]">
          Save items you love by clicking the heart icon.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-full bg-[#1E7F57] px-8 py-3 font-semibold text-white transition hover:bg-[#166b48]"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="hidden grid-cols-[40px_2.5fr_1fr_1.2fr_1fr_140px] gap-4 rounded-t-xl bg-[#FBC617] px-6 py-4 text-sm font-bold text-[#1a1a1a] md:grid">
        <span />
        <span>Product</span>
        <span>Price</span>
        <span>Date Added</span>
        <span>Stock Status</span>
        <span />
      </div>

      <div className="overflow-hidden rounded-b-xl border border-t-0 border-[#e5e5e5] max-md:rounded-xl max-md:border-t">
        {items.map((item) => {
          const inStock = (item.stock ?? 1) > 0;
          return (
            <div
              key={item.id}
              className="grid grid-cols-1 items-center gap-4 border-b border-[#e5e5e5] p-4 last:border-b-0 md:grid-cols-[40px_2.5fr_1fr_1.2fr_1fr_140px] md:px-6 md:py-5"
            >
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="hidden h-6 w-6 items-center justify-center text-[#6b6b6b] hover:text-red-500 md:flex"
                aria-label="Remove"
              >
                <X size={18} />
              </button>

              <div className="relative flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="absolute right-0 top-0 p-1 text-[#6b6b6b] hover:text-red-500 md:hidden"
                >
                  <X size={16} />
                </button>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#e5e5e5] bg-[#F9F9F9] text-3xl">
                  {item.emoji}
                </div>
                <div>
                  <Link
                    href={item.slug ? `/shop/${item.slug}` : "/shop"}
                    className="font-semibold text-[#1a1a1a] transition hover:text-[#1E7F57]"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-[#6b6b6b]">{item.weight}</p>
                </div>
              </div>

              <p className="font-bold text-[#1a1a1a] max-md:flex max-md:justify-between">
                <span className="md:hidden text-[#6b6b6b] font-normal">
                  Price:
                </span>
                ৳{item.price.toFixed(2)}
              </p>

              <p className="text-sm text-[#1a1a1a] max-md:flex max-md:justify-between">
                <span className="md:hidden text-[#6b6b6b]">Date Added:</span>
                {item.dateAdded}
              </p>

              <p
                className={`text-sm font-semibold max-md:flex max-md:justify-between ${
                  inStock ? "text-[#1E7F57]" : "text-red-500"
                }`}
              >
                <span className="md:hidden font-normal text-[#6b6b6b]">
                  Stock:
                </span>
                {inStock ? "Instock" : "Out of Stock"}
              </p>

              <button
                type="button"
                disabled={!inStock}
                onClick={() => handleAddToCart(item)}
                className="h-10 rounded-full bg-[#1E7F57] px-4 text-sm font-semibold text-white transition hover:bg-[#166b48] disabled:cursor-not-allowed disabled:bg-[#ccc]"
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-[#1a1a1a] underline">
            Wishlist link:
          </span>
          <input
            readOnly
            value={wishlistLink}
            className="h-11 min-w-55 flex-1 rounded-full border border-[#e5e5e5] px-4 text-sm text-[#6b6b6b] outline-none sm:max-w-xs"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="h-11 rounded-full bg-[#1E7F57] px-6 text-sm font-semibold text-white transition hover:bg-[#166b48]"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => clearWishlist()}
            className="text-sm font-semibold text-[#1E7F57] underline underline-offset-4 hover:text-red-500"
          >
            Clear Wishlist
          </button>
          <button
            type="button"
            onClick={handleAddAll}
            className="flex h-11 items-center gap-2 rounded-full bg-[#1E7F57] px-6 text-sm font-semibold text-white transition hover:bg-[#166b48]"
          >
            <ShoppingBag size={16} />
            Add All to Cart
          </button>
        </div>
      </div>
    </section>
  );
}