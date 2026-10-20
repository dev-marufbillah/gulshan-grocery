"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import ProductCard, { ProductItem } from "./ProductCard";

interface BestSellersProps {
  products?: ProductItem[];
}

// Best Sale page-er path. Apnar page onno path-e hole eta bodle nin.
const BEST_SALE_PATH = "/best-sale";

export default function BestSellers({ products = [] }: BestSellersProps) {
  // 2 line x 4 card = maximum 8 ta product
  const visibleProducts = products.slice(0, 8);

  return (
    <section className="py-6 sm:py-10 max-w-7xl mx-auto px-3 sm:px-6">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-4 sm:mb-6">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest flex items-center gap-1 mb-1">
            <Flame size={14} /> Top Choice
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900">
            Best <span className="text-[#1E7F57]">Sale</span>
          </h2>
        </div>

        <Link
          href={BEST_SALE_PATH}
          className="text-xs sm:text-sm font-bold text-[#1E7F57] hover:text-[#166343] flex items-center gap-1 bg-[#E8F3EE] hover:bg-[#d5e8de] px-3 py-2 rounded-full transition-all"
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>

      {/* Grid: Mobile-e 2 column, Desktop-e 4 column (2 line = 8 card) */}
      {visibleProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-medium text-sm">No best sale products found.</p>
        </div>
      )}
    </section>
  );
}