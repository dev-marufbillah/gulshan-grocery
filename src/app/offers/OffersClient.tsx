"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tag, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import OfferProductCard, { type OfferProduct } from "./OfferProductCard";

export default function OffersClient() {
  const [products, setProducts] = useState<OfferProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/offers");
        const data = await res.json();
        if (alive) setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-24 pt-4 md:pb-10 md:pt-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Top Bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#1E7F57]"
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
            <Sparkles size={14} /> Flash Deals
            {!loading && ` (${products.length})`}
          </span>
        </div>

        {/* Banner */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-linear-to-r from-[#1E7F57] to-[#114B33] p-6 text-white shadow-lg sm:p-10">
          <div className="relative z-10 max-w-xl">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <Tag size={14} /> Special Grocery Savings
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
              Best Deals &amp; Discounts! 🔥
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-white/90">
              Save big on your daily groceries. Fresh deals updated every day!
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-[#1E7F57]">
            <Loader2 size={36} className="animate-spin" />
            <p className="mt-3 text-sm font-semibold">Loading offers...</p>
          </div>
        )}

        {/* Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <OfferProductCard key={p._id} p={p} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-xs">
            <Tag size={48} className="mb-3 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-700">
              No active offers right now
            </h3>
            <p className="mt-1 max-w-sm text-xs text-gray-500">
              Admin → Add Product → <strong>Mark as Flash Deal</strong> টিক দাও +
              Old Price দিলেই এখানে আসবে।
            </p>
            <Link
              href="/shop"
              className="mt-5 rounded-full bg-[#1E7F57] px-6 py-2.5 text-xs font-semibold text-white"
            >
              Browse Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}