"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import ProductCard, { ProductItem } from "./ProductCard";

interface BestSellersProps {
  products?: ProductItem[];
}

export default function BestSellers({ products = [] }: BestSellersProps) {
  return (
    <section className="py-6 sm:py-10 max-w-7xl mx-auto px-3 sm:px-6">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-4 sm:mb-6">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest flex items-center gap-1 mb-1">
            <Flame size={14} /> Top Choice
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-gray-900">
            Best <span className="text-[#1E7F57]">Sellers</span>
          </h2>
        </div>

        <Link
          href="/shop"
          className="text-xs sm:text-sm font-bold text-[#1E7F57] hover:text-[#166343] flex items-center gap-1 bg-[#E8F3EE] hover:bg-[#d5e8de] px-3 py-2 rounded-full transition-all"
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>

      {/* Grid: Mobile-এ 2 Columns (grid-cols-2) */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-medium text-sm">No best sellers found.</p>
        </div>
      )}
    </section>
  );
}