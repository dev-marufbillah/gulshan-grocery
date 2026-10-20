"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  category: string;
  rating?: number;
  unit?: string;
  image?: string;
  inStock?: boolean;
  isFeatured?: boolean;
}

interface FeaturedProductsProps {
  products?: Product[];
}

export default function FeaturedProducts({ products = [] }: FeaturedProductsProps) {
  // ২ লাইনে ৪টি করে মোট ৮টি প্রোডাক্ট ফিল্টার করে দেখাবো
  const featuredList = products.filter((p) => p.isFeatured !== false);
  const displayProducts = (featuredList.length > 0 ? featuredList : products).slice(0, 8);

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase flex items-center gap-1">
              <span>✨</span> FRESH & HANDPICKED
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 font-serif mt-1">
              Featured <span className="text-emerald-700">Products</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-full hover:bg-emerald-100 transition-colors"
          >
            View All <span>&rarr;</span>
          </Link>
        </div>

        {/* Product Grid: Mobile (2 cols), Tablet (3 cols), Desktop (4 cols) -> 2 lines = 8 cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product, index) => (
            <ProductCard
              key={`${product._id || product.slug || "product"}-${index}`}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}