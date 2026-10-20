"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
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
  image: string;
};

// 🌟 Realistic Grocery Content for Gulshan Grocery (fallback + seed)
const POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "benefits-of-fresh-organic-vegetables",
    title: "Top 7 Benefits of Eating Fresh & Organic Vegetables",
    excerpt:
      "From boosting your immune system to ensuring zero chemical intake, discover why Gulshan Grocery highly recommends switching to organic vegetables today.",
    category: "Organic Food",
    author: "Gulshan Team",
    date: "20 October 2024",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    slug: "how-to-pick-perfect-summer-fruits",
    title: "Summer Produce Guide: How to Pick the Perfect Fruits",
    excerpt:
      "Mangoes, watermelons, and papayas! Learn the secret tips on how to pick the sweetest and freshest summer fruits from our local markets.",
    category: "Fruits & Vegetables",
    author: "Gulshan Team",
    date: "18 October 2024",
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    slug: "gulshan-grocery-quality-promise",
    title: "Gulshan Grocery’s Promise: Why We Guarantee Premium Quality",
    excerpt:
      "Have you ever wondered how we keep our products so fresh? Take a look behind the scenes at our rigorous quality check process.",
    category: "Grocery",
    author: "Store Manager",
    date: "15 October 2024",
    image:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    slug: "5-superfoods-for-daily-diet",
    title: "5 Superfoods You Need in Your Daily Diet for Better Health",
    excerpt:
      "Chia seeds, almonds, fresh avocados, and more! See how adding these 5 superfoods to your cart can transform your daily energy levels.",
    category: "Healthy Eating",
    author: "Nutrition Expert",
    date: "12 October 2024",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "5",
    slug: "weekly-grocery-shopping-tips",
    title: "Essential Shopping Tips for Your Weekly Grocery Run",
    excerpt:
      "Save time and money! Learn how to create the perfect grocery list so you never forget essentials when you visit Gulshan Grocery.",
    category: "Shopping Tips",
    author: "Gulshan Team",
    date: "10 October 2024",
    image:
      "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "6",
    slug: "fresh-bakery-items-morning",
    title: "Fresh Bakery Items to Start Your Morning Right",
    excerpt:
      "Nothing beats the smell of freshly baked bread in the morning. Discover our wide range of organic and whole-wheat bakery products.",
    category: "Bakery Products",
    author: "Gulshan Baker",
    date: "08 October 2024",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "7",
    slug: "spices-that-heal",
    title: "Spices that Heal: The Magic of Authentic Local Spices",
    excerpt:
      "Turmeric, ginger, and cumin don't just add flavor—they heal. Find out which essential spices you must stock up on this winter.",
    category: "Grocery",
    author: "Gulshan Team",
    date: "05 October 2024",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "8",
    slug: "benefits-of-herbal-tea",
    title: "Relax Your Mind: The Real Benefits of Drinking Herbal Tea",
    excerpt:
      "Stressed out? A warm cup of chamomile or green tea can work wonders. Explore our premium beverage collection.",
    category: "Healthy Eating",
    author: "Gulshan Team",
    date: "02 October 2024",
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop",
  },
];

const CATEGORIES = [
  "Shopping Tips",
  "Grocery",
  "Fruits & Vegetables",
  "Organic Food",
  "Healthy Eating",
  "Bakery Products",
];

const PAGE_SIZE = 5;

function formatDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function BlogClient() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>(POSTS);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  // Admin থেকে ব্লগ লোড — না পেলে/এরর হলে আপনার আগের POSTSই থাকবে
  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/blogs")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted || !Array.isArray(data) || data.length === 0) return;

        const mapped: BlogPost[] = data.map(
          (
            b: {
              _id?: string;
              id?: string;
              slug: string;
              title: string;
              intro?: string;
              excerpt?: string;
              category?: string;
              author?: string;
              createdAt?: string;
              date?: string;
              image?: string;
            },
            index: number
          ) => ({
            id: b._id || b.id || String(index + 1),
            slug: b.slug,
            title: b.title,
            excerpt: b.intro || b.excerpt || "",
            category: b.category || "Grocery",
            author: b.author || "Gulshan Team",
            date: formatDate(b.createdAt || b.date) || "Recently",
            image:
              b.image ||
              "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop",
          })
        );

        // Admin ব্লগ + আপনার আগের ব্লগ (slug ডুপ্লিকেট বাদ)
        const slugSet = new Set(mapped.map((p) => p.slug));
        const merged = [
          ...mapped,
          ...POSTS.filter((p) => !slugSet.has(p.slug)),
        ];
        setAllPosts(merged);
      })
      .catch(() => {
        // fallback: POSTS already set
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return allPosts.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchC = !category || p.category === category;
      return matchQ && matchC;
    });
  }, [query, category, allPosts]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const posts = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const recent = allPosts.slice(0, 3);

  const goPage = (n: number) => {
    setPage(Math.min(Math.max(1, n), totalPages));
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-12">
        {/* Left Side: Blog Posts */}
        <div>
          <div className="space-y-12">
            {posts.length === 0 && (
              <p className="rounded-2xl bg-[#F4F4F4] p-10 text-center text-[#6b6b6b]">
                No blogs found. Try another search or category.
              </p>
            )}

            {posts.map((post) => (
              <article key={post.id} className="group">
                <Link
                  href={`/blogs/${post.slug}`}
                  className="relative block overflow-hidden rounded-2xl"
                >
                  <div className="relative flex aspect-video md:aspect-21/9 w-full items-center justify-center bg-[#F4F4F4]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#1E7F57] text-white shadow-md transition group-hover:bg-[#166b48]">
                      <Share2 size={18} />
                    </span>
                    <span className="absolute bottom-4 left-4 rounded-lg bg-[#FBC617] px-3 py-1.5 text-xs font-bold text-[#1a1a1a]">
                      {post.category}
                    </span>
                  </div>
                </Link>

                <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-[#6b6b6b]">
                  <span className="font-semibold text-[#1a1a1a]">
                    {post.author}
                  </span>
                  <BadgeCheck size={16} className="text-[#1E7F57]" />
                  <span className="text-[#c4c4c4]">•</span>
                  <span>{post.date}</span>
                </div>

                <Link href={`/blogs/${post.slug}`}>
                  <h3 className="mt-3 text-xl font-bold leading-snug text-[#1a1a1a] transition hover:text-[#1E7F57] md:text-2xl">
                    {post.title}
                  </h3>
                </Link>

                <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blogs/${post.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-[#1E7F57] underline underline-offset-4 hover:text-[#166b48]"
                >
                  Read More
                </Link>
              </article>
            ))}
          </div>

          {/* Pagination */}
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

        {/* Right Side: Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          {/* Search Box */}
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
                placeholder="Search blogs..."
                className="h-full flex-1 bg-transparent text-sm outline-none"
              />
              <span className="flex h-11 w-11 items-center justify-center text-[#6b6b6b]">
                <Search size={18} />
              </span>
            </div>
          </div>

          {/* Categories */}
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
                  All Blogs
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

          {/* Recent Posts */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-4 w-1 rounded bg-[#FBC617]" />
              <h3 className="font-bold text-[#1a1a1a]">Recent Posts</h3>
            </div>
            <ul className="space-y-4">
              {recent.map((r) => (
                <li key={r.id}>
                  <Link href={`/blogs/${r.slug}`} className="group flex gap-3">
                    <div className="flex h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F4F4F4]">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1">
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

          {/* Ad Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#1E7F57] to-[#166b48] p-6 text-center text-white shadow-md">
            <div className="text-5xl drop-shadow-sm">🛒🥦</div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-white/80">
              Weekend Sale
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
              Shop Now
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}