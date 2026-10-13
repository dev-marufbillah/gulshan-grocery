import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { connection } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductCard, { ProductItem } from "@/components/ProductCard";
import Features from "@/components/Features";
import ShopFilters, { SortSelect } from "@/components/ShopControls";
import { PAGE_SIZE, buildQuery, parseState, type ShopState } from "@/lib/shop";

export const metadata = { title: "Shop | Gulshan Grocery" };

type SP = Promise<Record<string, string | string[] | undefined>>;

type ProductDoc = {
  _id: { toString(): string };
  name: string;
  slug: string;
  categoryName: string;
  weight?: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  image?: string;
  emoji?: string;
};

type CategoryDoc = {
  name: string;
  slug: string;
};

const SORTS: Record<string, Record<string, 1 | -1>> = {
  default: { order: 1, createdAt: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { rating: -1 },
  newest: { createdAt: -1 },
};

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, 2, 3, total, current - 1, current, current + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const n of nums) {
    if (prev && n - prev > 1) out.push("…");
    out.push(n);
    prev = n;
  }
  return out;
}

function ShopSkeleton() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-95 animate-pulse rounded-xl bg-[#F4F4F4]" />
          ))}
        </div>
      </div>
    </section>
  );
}

async function ShopContent({ searchParams }: { searchParams: SP }) {
  const state: ShopState = parseState(await searchParams);
  await connection();
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (state.q) filter.name = { $regex: escapeRegex(state.q), $options: "i" };
  if (state.category.length) filter.category = { $in: state.category };
  if (state.brand.length) filter.brand = { $in: state.brand };
  if (state.type.length) filter.productType = { $in: state.type };
  if (state.min !== null || state.max !== null) {
    filter.price = {
      ...(state.min !== null ? { $gte: state.min } : {}),
      ...(state.max !== null ? { $lte: state.max } : {}),
    };
  }
  if (state.rating.length) {
    filter.$or = state.rating.map((r) => {
      const n = Number(r);
      return n >= 5 ? { rating: { $gte: 5 } } : { rating: { $gte: n, $lt: n + 1 } };
    });
  }
  if (state.stock.length === 1) {
    filter.stock = state.stock[0] === "in" ? { $gt: 0 } : { $lte: 0 };
  }

  const sort = SORTS[state.sort] ?? SORTS.default;

  const [total, categories, brands, types, top] = await Promise.all([
    Product.countDocuments(filter),
    Category.find({}).sort({ order: 1 }).select("-_id name slug").lean<CategoryDoc[]>(),
    Product.distinct("brand"),
    Product.distinct("productType"),
    Product.findOne({}).sort({ price: -1 }).select("price").lean<{ price: number } | null>(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(state.page, totalPages);

  const docs = await Product.find(filter)
    .sort(sort)
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .lean<ProductDoc[]>();

  const products: ProductItem[] = docs.map((d) => ({
    id: d._id.toString(),
    slug: d.slug,
    name: d.name,
    categoryName: d.categoryName,
    weight: d.weight ?? "",
    price: d.price,
    oldPrice: d.oldPrice ?? 0,
    rating: d.rating ?? 4.5,
    image: d.image ?? "",
    emoji: d.emoji ?? "🛒",
  }));

  const maxPrice = Math.max(100, Math.ceil((top?.price ?? 1000) / 100) * 100);
  const brandList = (brands as string[]).filter(Boolean).sort();
  const typeList = (types as string[]).filter(Boolean).sort();
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  const chips: { label: string; href: string }[] = [];
  if (state.q) chips.push({ label: `Search: ${state.q}`, href: buildQuery({ ...state, q: "", page: 1 }) });
  state.category.forEach((v) =>
    chips.push({ label: catName(v), href: buildQuery({ ...state, category: state.category.filter((x) => x !== v), page: 1 }) })
  );
  if (state.min !== null || state.max !== null) {
    chips.push({
      label: `Price : ৳${state.min ?? 0} - ৳${state.max ?? maxPrice}`,
      href: buildQuery({ ...state, min: null, max: null, page: 1 }),
    });
  }
  state.rating.forEach((v) =>
    chips.push({ label: `${v} Star`, href: buildQuery({ ...state, rating: state.rating.filter((x) => x !== v), page: 1 }) })
  );
  state.brand.forEach((v) =>
    chips.push({ label: v, href: buildQuery({ ...state, brand: state.brand.filter((x) => x !== v), page: 1 }) })
  );
  state.type.forEach((v) =>
    chips.push({ label: v, href: buildQuery({ ...state, type: state.type.filter((x) => x !== v), page: 1 }) })
  );
  state.stock.forEach((v) =>
    chips.push({
      label: v === "in" ? "In Stock" : "Out of Stock",
      href: buildQuery({ ...state, stock: state.stock.filter((x) => x !== v), page: 1 }),
    })
  );

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
          <aside>
            <ShopFilters
              categories={categories}
              brands={brandList}
              types={typeList}
              maxPrice={maxPrice}
              state={state}
            />
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-[#1a1a1a]">
                {total === 0
                  ? "No results found"
                  : `Showing ${from}-${to} of ${total} results`}
              </p>
              <div className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                <span>Sort by :</span>
                <SortSelect state={state} />
              </div>
            </div>

            {chips.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-sm text-[#1a1a1a]">Active Filter</span>
                {chips.map((c) => (
                  <Link
                    key={c.label + c.href}
                    href={c.href}
                    scroll={false}
                    className="inline-flex items-center gap-2 rounded-full bg-[#FBC617] px-4 py-1.5 text-sm font-medium text-[#1a1a1a]"
                  >
                    {c.label}
                    <X size={14} />
                  </Link>
                ))}
                <Link
                  href="/shop"
                  scroll={false}
                  className="text-sm text-[#1E7F57] underline underline-offset-4"
                >
                  Clear All
                </Link>
              </div>
            )}

            {products.length === 0 ? (
              <div className="mt-8 rounded-xl bg-[#F4F4F4] p-10 text-center text-[#6b6b6b]">
                Kono product paoa jayni. Filter bodle dekho ba{" "}
                <Link href="/shop" className="text-[#1E7F57] underline">
                  sob filter muchhe dao
                </Link>
                .
              </div>
            ) : (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 [&>div]:w-full">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-2 text-sm">
                {page > 1 ? (
                  <Link
                    href={buildQuery({ ...state, page: page - 1 })}
                    aria-label="Previous page"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[#1a1a1a] hover:bg-[#F4F4F4]"
                  >
                    <ChevronLeft size={18} />
                  </Link>
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center text-[#c4c4c4]">
                    <ChevronLeft size={18} />
                  </span>
                )}

                {pageList(page, totalPages).map((n, i) =>
                  n === "…" ? (
                    <span key={`d${i}`} className="px-1 text-[#6b6b6b]">
                      ...
                    </span>
                  ) : (
                    <Link
                      key={n}
                      href={buildQuery({ ...state, page: n })}
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-medium ${
                        n === page
                          ? "bg-[#1E7F57] text-white"
                          : "text-[#1a1a1a] hover:bg-[#F4F4F4]"
                      }`}
                    >
                      {n}
                    </Link>
                  )
                )}

                {page < totalPages ? (
                  <Link
                    href={buildQuery({ ...state, page: page + 1 })}
                    aria-label="Next page"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[#1a1a1a] hover:bg-[#F4F4F4]"
                  >
                    <ChevronRight size={18} />
                  </Link>
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center text-[#c4c4c4]">
                    <ChevronRight size={18} />
                  </span>
                )}
              </nav>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ShopPage({ searchParams }: { searchParams: SP }) {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#F4F4F4]">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage: "radial-gradient(#d9d9d9 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 text-center md:px-6 md:py-16">
          <h1 className="text-4xl font-semibold text-[#1a1a1a] md:text-5xl">Shop</h1>
          <p className="mt-4 text-base text-[#1a1a1a]">
            <Link href="/" className="hover:text-[#1E7F57]">
              Home
            </Link>
            <span className="mx-3">/</span>
            Shop
          </p>
        </div>
      </section>

      <Suspense fallback={<ShopSkeleton />}>
        <ShopContent searchParams={searchParams} />
      </Suspense>

      <Features />
    </main>
  );
}