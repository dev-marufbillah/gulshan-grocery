"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Share2,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  emoji: string;
  gradient: string;
};

const POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "grocery-shopping-list",
    title: "How to Create a Grocery Shopping List: Stay Organized and Efficient",
    excerpt:
      "Plan your weekly meals, check your pantry, and group items by aisle so you never miss essentials at Gulshan Grocery.",
    category: "Shopping Tips",
    author: "Jenny Alexander",
    date: "14 July 2024",
    emoji: "📝🛒",
    gradient: "from-[#d4ebe0] to-[#b8dcc8]",
  },
  {
    id: "2",
    slug: "summer-produce-guide",
    title: "Summer Produce Guide: Fresh Fruits and Vegetables to Enjoy",
    excerpt:
      "Mango, watermelon, cucumber and leafy greens—what’s in season in Bangladesh and how to pick the freshest ones.",
    category: "Seasonal Guides",
    author: "Jenny Alexander",
    date: "13 July 2024",
    emoji: "🥭🍉",
    gradient: "from-[#ffe8c8] to-[#ffd19a]",
  },
  {
    id: "3",
    slug: "top-10-superfoods",
    title: "Top 10 Superfoods for a Balanced Diet: Boost Your Health",
    excerpt:
      "From spinach and lentils to yogurt and nuts—simple superfoods you can add to your daily basket.",
    category: "Healthy Eating",
    author: "Jenny Alexander",
    date: "12 July 2024",
    emoji: "🥗💪",
    gradient: "from-[#e0f0ff] to-[#b8d9f5]",
  },
  {
    id: "4",
    slug: "benefits-of-organic",
    title: "Benefits of Organic Foods: Why You Should Consider Going Organic",
    excerpt:
      "Less chemicals, better taste, and support for local farms—why organic options are worth it for your family.",
    category: "Organic Food",
    author: "Jenny Alexander",
    date: "11 July 2024",
    emoji: "🌱🥬",
    gradient: "from-[#e8f5ee] to-[#c5e6d0]",
  },
  {
    id: "5",
    slug: "whats-in-season",
    title: "What's in Season: Summer Produce Guide for Fresh Fruits & Vegetables",
    excerpt:
      "A quick guide to seasonal buys in Dhaka markets and how Gulshan Grocery keeps them fresh for delivery.",
    category: "Seasonal Guides",
    author: "Jenny Alexander",
    date: "10 July 2024",
    emoji: "🍍🍊",
    gradient: "from-[#fff0e0] to-[#ffd8b0]",
  },
  {
    id: "6",
    slug: "healthy-snacks",
    title: "Top 10 Healthy Snacks for Busy Families",
    excerpt:
      "Quick, nutritious snack ideas you can grab from our store for kids and office days.",
    category: "Healthy Eating",
    author: "Jenny Alexander",
    date: "10 July 2024",
    emoji: "🥜🍇",
    gradient: "from-[#f3e8ff] to-[#e0d0ff]",
  },
  {
    id: "7",
    slug: "herbal-teas",
    title: "The Best Beverages to Keep You Hydrated: Herbal Teas",
    excerpt:
      "Stay cool in Dhaka heat with hydrating drinks and light herbal options from our beverage aisle.",
    category: "Grocery",
    author: "Jenny Alexander",
    date: "09 July 2024",
    emoji: "🍵💧",
    gradient: "from-[#e8f4ff] to-[#c8e4ff]",
  },
  {
    id: "8",
    slug: "drinking-herbal-teas",
    title: "The Benefits of Drinking Herbal Teas",
    excerpt:
      "Calm evenings, better digestion, and simple rituals—how herbal tea fits a healthy grocery routine.",
    category: "Healthy Eating",
    author: "Jenny Alexander",
    date: "08 July 2024",
    emoji: "🫖✨",
    gradient: "from-[#fff5e6] to-[#ffe0b3]",
  },
];

const CATEGORIES = [
  "Shopping Tips",
  "Grocery",
  "Fruits & Vegetables",
  "Organic Food",
  "Bakery Products",
];

const PAGE_SIZE = 5;

export default function BlogClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return POSTS.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchC = !category || p.category === category;
      return matchQ && matchC;
    });
  }, [query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const posts = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const recent = POSTS.slice(0, 3);

  const goPage = (n: number) => {
    setPage(Math.min(Math.max(1, n), totalPages));
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-12">
        <div>
          <div className="space-y-12">
            {posts.length === 0 && (
              <p className="rounded-2xl bg-[#F4F4F4] p-10 text-center text-[#6b6b6b]">
                No blogs found. Try another search or category.
              </p>
            )}

            {posts.map((post) => (
              <article key={post.id} className="group">
                <Link href={`/blogs/${post.slug}`} className="relative block">
                  <div
                    className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br ${post.gradient}`}
                  >
                    <span className="text-6xl md:text-7xl">{post.emoji}</span>
                    <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#1E7F57] text-white shadow-md transition group-hover:scale-105">
                      <Share2 size={18} />
                    </span>
                    <span className="absolute bottom-4 left-4 rounded-lg bg-[#FBC617] px-3 py-1.5 text-xs font-bold text-[#1a1a1a]">
                      {post.category}
                    </span>
                  </div>
                </Link>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#6b6b6b]">
                  <span className="font-medium text-[#1a1a1a]">
                    {post.author}
                  </span>
                  <BadgeCheck size={14} className="text-[#1E7F57]" />
                  <span className="text-[#c4c4c4]">•</span>
                  <span>{post.date}</span>
                </div>

                <Link href={`/blogs/${post.slug}`}>
                  <h3 className="mt-2 text-xl font-bold leading-snug text-[#1a1a1a] transition hover:text-[#1E7F57] md:text-2xl">
                    {post.title}
                  </h3>
                </Link>

                <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blogs/${post.slug}`}
                  className="mt-3 inline-block text-sm font-semibold text-[#1E7F57] underline underline-offset-4 hover:text-[#166b48]"
                >
                  Read More
                </Link>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-14 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => goPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#1a1a1a] hover:bg-[#F4F4F4] disabled:text-[#ccc]"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => {
                  if (totalPages <= 5) return true;
                  return (
                    n === 1 ||
                    n === totalPages ||
                    Math.abs(n - currentPage) <= 1
                  );
                })
                .reduce<(number | "…")[]>((acc, n, idx, arr) => {
                  if (
                    idx > 0 &&
                    typeof arr[idx - 1] === "number" &&
                    n - (arr[idx - 1] as number) > 1
                  ) {
                    acc.push("…");
                  }
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, i) =>
                  n === "…" ? (
                    <span key={`d${i}`} className="px-1 text-[#6b6b6b]">
                      …
                    </span>
                  ) : (
                    <button
                      key={n}
                      type="button"
                      onClick={() => goPage(n)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                        n === currentPage
                          ? "bg-[#1E7F57] text-white"
                          : "text-[#1a1a1a] hover:bg-[#F4F4F4]"
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}

              <button
                type="button"
                onClick={() => goPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#1a1a1a] hover:bg-[#F4F4F4] disabled:text-[#ccc]"
              >
                <ChevronRight size={18} />
              </button>
            </nav>
          )}
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-4 w-1 rounded bg-[#FBC617]" />
              <h3 className="font-bold text-[#1a1a1a]">Search</h3>
            </div>
            <div className="flex h-11 items-center overflow-hidden rounded-full border border-[#e5e5e5] bg-white pl-4">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search"
                className="h-full flex-1 bg-transparent text-sm outline-none"
              />
              <span className="flex h-11 w-11 items-center justify-center text-[#6b6b6b]">
                <Search size={18} />
              </span>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-4 w-1 rounded bg-[#FBC617]" />
              <h3 className="font-bold text-[#1a1a1a]">Popular Category</h3>
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setCategory("");
                    setPage(1);
                  }}
                  className={`w-full rounded-full border px-4 py-2.5 text-left text-sm transition ${
                    !category
                      ? "border-[#1E7F57] bg-[#E8F3EE] font-semibold text-[#1E7F57]"
                      : "border-[#e5e5e5] text-[#1a1a1a] hover:border-[#1E7F57]"
                  }`}
                >
                  All
                </button>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => {
                      setCategory(c);
                      setPage(1);
                    }}
                    className={`w-full rounded-full border px-4 py-2.5 text-left text-sm transition ${
                      category === c
                        ? "border-[#1E7F57] bg-[#E8F3EE] font-semibold text-[#1E7F57]"
                        : "border-[#e5e5e5] text-[#1a1a1a] hover:border-[#1E7F57]"
                    }`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-4 w-1 rounded bg-[#FBC617]" />
              <h3 className="font-bold text-[#1a1a1a]">Recent Post</h3>
            </div>
            <ul className="space-y-4">
              {recent.map((r) => (
                <li key={r.id}>
                  <Link href={`/blogs/${r.slug}`} className="group flex gap-3">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${r.gradient} text-xl`}
                    >
                      {r.emoji.slice(0, 2)}
                    </div>
                    <div>
                      <p className="line-clamp-2 text-sm font-semibold leading-snug text-[#1a1a1a] transition group-hover:text-[#1E7F57]">
                        {r.title}
                      </p>
                      <p className="mt-1 text-xs text-[#6b6b6b]">{r.date}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#1E7F57] to-[#166b48] p-6 text-center text-white shadow-md">
            <div className="text-5xl">🥗👩</div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/80">
              Summer Sale
            </p>
            <p className="mt-2 text-xl font-bold leading-snug">
              20% Off on
              <br />
              Freshest Produce
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex rounded-full bg-[#FBC617] px-6 py-2.5 text-sm font-bold text-[#1a1a1a] transition hover:bg-yellow-400"
            >
              Buy Now
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}