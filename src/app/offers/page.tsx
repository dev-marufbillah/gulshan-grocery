"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tag, ArrowLeft, Sparkles, ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/store/cart";

type OfferProduct = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  weight?: string | null;
  image?: string | null;
};

export default function OffersPage() {
  const [products, setProducts] = useState<OfferProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);

  const cartStore = useCartStore();

  useEffect(() => {
    let isMounted = true;
    async function fetchOffers() {
      try {
        const res = await fetch("/api/offers");
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }
        const data = await res.json();
        if (isMounted) {
          setProducts(data.products || []);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load offers", err);
        if (isMounted) {
          setProducts([]);
          setLoading(false);
        }
      }
    }
    fetchOffers();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToCart = (e: React.MouseEvent, p: OfferProduct) => {
    e.preventDefault();
    e.stopPropagation();

    const itemData = {
      id: p._id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      image: p.image ?? undefined,
      weight: p.weight ?? undefined,
      qty: 1,
      quantity: 1,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const store = cartStore as any;
    if (typeof store.addItem === "function") {
      store.addItem(itemData);
    } else if (typeof store.addToCart === "function") {
      store.addToCart(itemData);
    }

    setAddedId(p._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-24 pt-4 md:pb-10 md:pt-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Top Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#1E7F57]"
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
            <Sparkles size={14} /> Flash Deals {!loading && `(${products.length})`}
          </span>
        </div>

        {/* Banner with Tailwind v4 bg-linear-to-r */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-linear-to-r from-[#1E7F57] to-[#114B33] p-6 text-white shadow-lg sm:p-10">
          <div className="relative z-10 max-w-xl">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-xs">
              <Tag size={14} /> Special Savings
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
              Best Deals &amp; Discounts! 🔥
            </h1>
            <p className="mt-2 text-xs text-white/90 sm:text-sm">
              Save big on your daily groceries. Fresh deals updated every day!
            </p>
          </div>
        </div>

        {/* Skeleton Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-2xl border border-gray-100 bg-white p-3 shadow-xs"
              >
                <div className="aspect-square w-full rounded-xl bg-gray-200" />
                <div className="mt-3 h-4 w-3/4 rounded-md bg-gray-200" />
                <div className="mt-2 h-3 w-1/2 rounded-md bg-gray-200" />
                <div className="mt-4 h-9 w-full rounded-xl bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => {
              const discount =
                p.oldPrice && p.oldPrice > p.price
                  ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                  : null;

              const isAdded = addedId === p._id;

              return (
                <div
                  key={p._id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-xs transition hover:shadow-md"
                >
                  {/* Discount Badge */}
                  {discount && (
                    <span className="absolute left-3 top-3 z-10 rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      {discount}% OFF
                    </span>
                  )}

                  {/* Image & Title */}
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

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, p)}
                    className={`mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                      isAdded
                        ? "bg-[#1a1a1a] text-white"
                        : "bg-[#E8F3EE] text-[#1E7F57] hover:bg-[#1E7F57] hover:text-white"
                    }`}
                  >
                    {isAdded ? (
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
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-xs">
            <Tag size={48} className="mb-3 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-700">No active offers right now</h3>
            <p className="mt-1 max-w-sm text-xs text-gray-500">
              Admin → Products পেজে গিয়ে যে কোনো প্রোডাক্ট এডিট করে <strong>Mark as Flash Deal</strong> টিক দিন বা Old Price যোগ করুন।
            </p>
            <Link
              href="/admin/products"
              className="mt-5 rounded-full bg-[#1E7F57] px-6 py-2.5 text-xs font-semibold text-white"
            >
              Go to Admin Products
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}