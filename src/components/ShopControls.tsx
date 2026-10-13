"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, Star } from "lucide-react";
import { buildQuery, type ShopState } from "@/lib/shop";

type ListKey = "category" | "rating" | "brand" | "type" | "stock";
type Option = { value: string; label: string; stars?: number };

const thumb =
  "pointer-events-none absolute inset-x-0 top-1/2 z-10 h-1.5 w-full -translate-y-1/2 appearance-none bg-transparent " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 " +
  "[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full " +
  "[&::-webkit-slider-thumb]:bg-[#1E7F57] " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 " +
  "[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 " +
  "[&::-moz-range-thumb]:bg-[#1E7F57]";

function PriceFilter({
  max,
  lo0,
  hi0,
  onCommit,
}: {
  max: number;
  lo0: number;
  hi0: number;
  onCommit: (min: number | null, max: number | null) => void;
}) {
  const [lo, setLo] = useState(lo0);
  const [hi, setHi] = useState(hi0);
  const step = 10;

  const commit = () => onCommit(lo <= 0 ? null : lo, hi >= max ? null : hi);

  return (
    <div>
      <p className="text-sm text-[#4b4b4b]">
        ৳{lo} - ৳{hi}
      </p>
      <div className="relative mt-4 h-5">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded bg-[#e5e5e5]" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded bg-[#1E7F57]"
          style={{
            left: `${(lo / max) * 100}%`,
            width: `${((hi - lo) / max) * 100}%`,
          }}
        />
        <input
          type="range"
          min={0}
          max={max}
          step={step}
          value={lo}
          onChange={(e) => setLo(Math.min(Number(e.target.value), hi - step))}
          onPointerUp={commit}
          onKeyUp={commit}
          aria-label="Minimum price"
          className={thumb}
        />
        <input
          type="range"
          min={0}
          max={max}
          step={step}
          value={hi}
          onChange={(e) => setHi(Math.max(Number(e.target.value), lo + step))}
          onPointerUp={commit}
          onKeyUp={commit}
          aria-label="Maximum price"
          className={thumb}
        />
      </div>
    </div>
  );
}

export default function ShopFilters({
  categories,
  brands,
  types,
  maxPrice,
  state,
}: {
  categories: { name: string; slug: string }[];
  brands: string[];
  types: string[];
  maxPrice: number;
  state: ShopState;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const go = (next: ShopState) =>
    router.push(buildQuery({ ...next, page: 1 }), { scroll: false });

  const toggle = (key: ListKey, value: string) => {
    const cur = state[key];
    const nextList = cur.includes(value)
      ? cur.filter((v) => v !== value)
      : [...cur, value];
    go({ ...state, [key]: nextList });
  };

  const renderGroup = (
    title: string,
    key: ListKey,
    options: Option[],
    scroll = false
  ) => {
    if (options.length === 0) return null;
    return (
      <div className="border-b border-[#e5e5e5] py-5">
        <h3 className="text-base font-semibold text-[#1a1a1a]">{title}</h3>
        <ul
          className={`mt-4 space-y-3 ${
            scroll ? "max-h-[230px] overflow-y-auto pr-2" : ""
          }`}
        >
          {options.map((o) => (
            <li key={o.value}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-[#4b4b4b]">
                <input
                  type="checkbox"
                  checked={state[key].includes(o.value)}
                  onChange={() => toggle(key, o.value)}
                  className="h-4 w-4 cursor-pointer accent-[#1E7F57]"
                />
                {o.stars ? (
                  <span className="flex items-center gap-2">
                    <span className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          className={i < o.stars! ? "text-[#FBC617]" : "text-[#d9d9d9]"}
                          fill={i < o.stars! ? "#FBC617" : "#d9d9d9"}
                        />
                      ))}
                    </span>
                    {o.label}
                  </span>
                ) : (
                  o.label
                )}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg bg-[#F4F4F4] px-4 py-3 text-base font-semibold text-[#1a1a1a] lg:hidden"
      >
        Filter Options
        <SlidersHorizontal size={18} />
      </button>

      <div className={`${open ? "block" : "hidden"} lg:block`}>
        <h2 className="hidden border-b border-[#e5e5e5] pb-4 text-xl font-semibold text-[#1a1a1a] lg:block">
          Filter Options
        </h2>

        {renderGroup(
          "Category",
          "category",
          categories.map((c) => ({ value: c.slug, label: c.name })),
          true
        )}

        <div className="border-b border-[#e5e5e5] py-5">
          <h3 className="text-base font-semibold text-[#1a1a1a]">Price</h3>
          <div className="mt-3">
            <PriceFilter
              key={`${state.min}-${state.max}`}
              max={maxPrice}
              lo0={state.min ?? 0}
              hi0={state.max ?? maxPrice}
              onCommit={(min, max) => go({ ...state, min, max })}
            />
          </div>
        </div>

        {renderGroup(
          "Review",
          "rating",
          [5, 4, 3, 2, 1].map((n) => ({
            value: String(n),
            label: `${n} Star`,
            stars: n,
          }))
        )}

        {renderGroup(
          "Brand",
          "brand",
          brands.map((b) => ({ value: b, label: b }))
        )}

        {renderGroup(
          "Product Type",
          "type",
          types.map((t) => ({ value: t, label: t }))
        )}

        {renderGroup("Availability", "stock", [
          { value: "in", label: "In Stock" },
          { value: "out", label: "Out of Stock" },
        ])}
      </div>
    </div>
  );
}

export function SortSelect({ state }: { state: ShopState }) {
  const router = useRouter();

  return (
    <select
      value={state.sort}
      onChange={(e) =>
        router.push(buildQuery({ ...state, sort: e.target.value, page: 1 }), {
          scroll: false,
        })
      }
      className="h-11 cursor-pointer rounded-full border border-[#e5e5e5] bg-white px-5 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1E7F57]"
    >
      <option value="default">Default Sorting</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating">Top Rated</option>
      <option value="newest">Newest</option>
    </select>
  );
}