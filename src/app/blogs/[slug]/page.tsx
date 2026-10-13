import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ShieldCheck, CreditCard, Headphones } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

type BlogDetail = {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  emoji: string;
  gradient: string;
  intro: string;
  sections: {
    id: string;
    title: string;
    body: string;
  }[];
  tips: string[];
  features: { num: string; title: string; text: string }[];
  alsoRead: { title: string; slug: string };
};

const BLOGS: Record<string, BlogDetail> = {
  "grocery-shopping-list": {
    slug: "grocery-shopping-list",
    title: "How to Create a Grocery Shopping List: Stay Organized and Efficient",
    category: "Shopping Tips",
    author: "Jenny Alexander",
    date: "14 July 2024",
    readTime: "12 min Read",
    emoji: "📝🛒🥬",
    gradient: "from-[#d4ebe0] to-[#b8dcc8]",
    intro:
      "A clear grocery list saves time, money and stress. Whether you shop in-store in Gulshan or order online from Gulshan Grocery, a simple system keeps every trip efficient and your kitchen always stocked.",
    sections: [
      {
        id: "importance",
        title: "Importance of an Organized Grocery Shopping List",
        body: "Without a list, impulse buys add up and essentials get forgotten. An organized list helps you stick to your budget, reduce food waste, and finish shopping faster. Group items the way aisles are laid out—or how our online categories work—so you move with purpose.",
      },
      {
        id: "inventory",
        title: "Evaluate Your Current Inventory",
        body: "Before you write anything, open the fridge, freezer and pantry. Note what is running low and what must be used this week. This step alone cuts duplicate purchases and inspires meals from what you already own.",
      },
      {
        id: "categorize",
        title: "Categorize Your Grocery List",
        body: "Split your list into Produce, Dairy & Eggs, Meat & Fish, Rice & Grains, Snacks, Beverages and Household. On Gulshan Grocery you can filter by the same groups, add to cart in one flow, and check out without backtracking.",
      },
      {
        id: "seasonal",
        title: "Focus on Seasonal and Fresh Produce",
        body: "Seasonal fruits and vegetables taste better and cost less. In Bangladesh summers look for mango, watermelon and leafy greens; winters bring oranges, carrots and cauliflower. Our shop highlights fresh daily stock for Gulshan delivery.",
      },
      {
        id: "tips",
        title: "Tips for an Efficient Shopping Experience",
        body: "Shop after a light meal so you are not hungry, stick to the list, compare unit prices, and choose a delivery window that fits your day. Online ordering with Gulshan Grocery means you can build the list on your phone and receive it at your door.",
      },
    ],
    tips: [
      "Plan meals for 5–7 days before writing the list.",
      "Check promotions and weekly deals on fruits and dairy.",
      "Keep a running notes app list during the week.",
      "Add buffer staples: rice, lentils, oil, onions, eggs.",
    ],
    features: [
      {
        num: "01",
        title: "Health Benefits",
        text: "Balanced lists mean more produce and fewer junk impulse buys for your family.",
      },
      {
        num: "02",
        title: "Development",
        text: "Build a repeatable weekly habit that gets faster every time you shop.",
      },
      {
        num: "03",
        title: "Testing",
        text: "Try the list for two weeks, then adjust categories that you always miss.",
      },
    ],
    alsoRead: {
      title: "The Benefits of Drinking Herbal Teas",
      slug: "drinking-herbal-teas",
    },
  },
  "summer-produce-guide": {
    slug: "summer-produce-guide",
    title: "Summer Produce Guide: Fresh Fruits and Vegetables to Enjoy",
    category: "Seasonal Guides",
    author: "Jenny Alexander",
    date: "13 July 2024",
    readTime: "8 min Read",
    emoji: "🥭🍉🥒",
    gradient: "from-[#ffe8c8] to-[#ffd19a]",
    intro:
      "Bangladesh summers are perfect for hydrating fruits and light vegetables. Here is how to pick the best and keep them fresh at home.",
    sections: [
      {
        id: "importance",
        title: "Why Seasonal Produce Matters",
        body: "Seasonal crops travel less, taste better and support local farmers supplying Dhaka markets and our Gulshan dark store.",
      },
      {
        id: "inventory",
        title: "Must-Have Summer Fruits",
        body: "Mango, lychee, watermelon, pineapple and guava—choose firm fruit with good colour and natural aroma.",
      },
      {
        id: "categorize",
        title: "Cooling Vegetables",
        body: "Cucumber, bottle gourd, leafy greens and tomatoes keep meals light. Store greens wrapped and dry.",
      },
      {
        id: "seasonal",
        title: "Storage Tips",
        body: "Keep bananas separate, refrigerate berries quickly, and wash produce just before eating.",
      },
      {
        id: "tips",
        title: "Order Fresh Online",
        body: "Use Gulshan Grocery filters for Fruits & Vegetables and schedule morning delivery for maximum freshness.",
      },
    ],
    tips: [
      "Buy mangoes slightly firm if you will eat them in 2–3 days.",
      "Keep herbs in a glass of water in the fridge.",
      "Freeze extra watermelon for smoothies.",
      "Pair cucumber and lemon for easy hydration.",
    ],
    features: [
      {
        num: "01",
        title: "Hydration",
        text: "Water-rich fruits help you stay cool in Dhaka heat.",
      },
      {
        num: "02",
        title: "Nutrition",
        text: "Colourful produce brings vitamins without heavy meals.",
      },
      {
        num: "03",
        title: "Value",
        text: "Seasonal items are usually cheaper and fresher.",
      },
    ],
    alsoRead: {
      title: "How to Create a Grocery Shopping List",
      slug: "grocery-shopping-list",
    },
  },
};

const FALLBACK = (slug: string): BlogDetail => ({
  slug,
  title: slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" "),
  category: "Grocery",
  author: "Jenny Alexander",
  date: "10 July 2024",
  readTime: "6 min Read",
  emoji: "🛒🥗",
  gradient: "from-[#e8f5ee] to-[#cfe8da]",
  intro:
    "Practical tips from Gulshan Grocery to help you shop smarter, eat fresher and waste less at home in Dhaka.",
  sections: [
    {
      id: "importance",
      title: "Getting Started",
      body: "Small habits—like a weekly list and seasonal buys—make grocery runs simpler for every family in Gulshan.",
    },
    {
      id: "inventory",
      title: "What to Prioritize",
      body: "Always secure staples first: rice, lentils, oil, eggs, onions, and a mix of fruits and vegetables.",
    },
    {
      id: "categorize",
      title: "Shop by Category",
      body: "Use our online categories to mirror a smart list and checkout in minutes.",
    },
    {
      id: "seasonal",
      title: "Stay Fresh",
      body: "Store correctly and cook perishables early in the week.",
    },
    {
      id: "tips",
      title: "Final Tips",
      body: "Track orders, save favourites, and reorder staples with one click.",
    },
  ],
  tips: [
    "Reorder staples before you run out.",
    "Compare unit prices on packaged goods.",
    "Use COD or bKash at checkout.",
    "Rate products to help other shoppers.",
  ],
  features: [
    {
      num: "01",
      title: "Health Benefits",
      text: "Better planning leads to better meals.",
    },
    {
      num: "02",
      title: "Development",
      text: "Improve your routine each week.",
    },
    {
      num: "03",
      title: "Testing",
      text: "Adjust based on what your household actually eats.",
    },
  ],
  alsoRead: {
    title: "How to Create a Grocery Shopping List",
    slug: "grocery-shopping-list",
  },
});

const RELATED = [
  {
    slug: "healthy-snacks",
    title: "Healthy Snacks for Busy Professionals: Delivery Edition",
    category: "Shopping Tips",
    date: "07 July 2024",
    emoji: "🥜💼",
    gradient: "from-[#e0f0ff] to-[#b8d9f5]",
  },
  {
    slug: "grocery-shopping-list",
    title: "Tips for Organizing Your Kitchen with Delivered Groceries",
    category: "Grocery Delivery",
    date: "06 July 2024",
    emoji: "📦🏠",
    gradient: "from-[#fff0e0] to-[#ffd8b0]",
  },
  {
    slug: "top-10-superfoods",
    title: "10 Quick and Healthy Meals You Can Make with Delivered Groceries",
    category: "Healthy Meals",
    date: "05 July 2024",
    emoji: "🍳🥗",
    gradient: "from-[#e8f5ee] to-[#c5e6d0]",
  },
];

const SIDEBAR_CATEGORIES = [
  "Shopping Tips",
  "Grocery",
  "Fruits & Vegetables",
  "Organic Food",
  "Bakery Products",
  "Bakery & Bread",
  "Beverages",
  "Snacks",
  "Pet Food",
];

async function BlogDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOGS[slug] ?? (slug ? FALLBACK(slug) : null);
  if (!post) notFound();

  const toc = post.sections.map((s) => ({ id: s.id, title: s.title }));

  return (
    <main className="bg-white">
      <section
        className="relative bg-[#F9F9F9] py-14 text-center"
        style={{
          backgroundImage: "radial-gradient(#d9d9d9 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      >
        <h1 className="text-4xl font-bold text-[#1a1a1a]">Blog Details</h1>
        <p className="mt-3 text-sm font-medium text-[#6b6b6b]">
          <Link href="/" className="hover:text-[#1E7F57]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blogs" className="hover:text-[#1E7F57]">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#1E7F57]">Blog Details</span>
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-12 md:px-6">
        <div
          className={`relative flex aspect-21/9 items-center justify-center overflow-hidden rounded-3xl bg-linear-to-br ${post.gradient}`}
        >
          <span className="text-7xl md:text-8xl">{post.emoji}</span>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pt-8 text-center md:px-6">
        <span className="inline-block rounded-full bg-[#FBC617] px-4 py-1.5 text-xs font-bold text-[#1a1a1a]">
          {post.category}
        </span>
        <h1 className="mt-5 text-3xl font-bold leading-snug text-[#1a1a1a] md:text-4xl">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-[#6b6b6b]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F3EE] text-sm">
            👩
          </span>
          <span>
            Written by{" "}
            <span className="font-semibold text-[#1a1a1a]">{post.author}</span>
          </span>
          <span className="text-[#c4c4c4]">|</span>
          <span>
            {post.date} | {post.readTime}
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[72px_1fr_300px] lg:gap-8">
          <aside className="hidden flex-col items-center gap-3 lg:flex">
            <p className="text-[10px] font-bold tracking-widest text-[#9a9a9a]">
              SHARE
            </p>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E7F57] text-white transition hover:bg-[#166b48]"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FBC617] text-[#1a1a1a] transition hover:bg-yellow-400"
            >
              <FaTwitter size={14} />
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E7F57] text-white transition hover:bg-[#166b48]"
            >
              <FaLinkedinIn size={14} />
            </a>
          </aside>

          <article className="min-w-0">
            <p className="text-base leading-relaxed text-[#4b4b4b]">
              {post.intro}
            </p>

            <div className="mt-10 space-y-10">
              {post.sections.map((sec, idx) => (
                <div key={sec.id} id={sec.id}>
                  <h2 className="text-xl font-bold text-[#1a1a1a] md:text-2xl">
                    {sec.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b] md:text-base">
                    {sec.body}
                  </p>

                  {idx === 1 && (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="flex aspect-4/3 items-center justify-center rounded-2xl bg-[#E8F3EE] text-5xl">
                        🍌🛒
                      </div>
                      <div className="flex aspect-4/3 items-center justify-center rounded-2xl bg-[#FFF3D6] text-5xl">
                        🧾👩
                      </div>
                    </div>
                  )}

                  {idx === 2 && (
                    <div className="mt-6 rounded-2xl bg-[#1E7F57] px-6 py-5 text-white">
                      <p className="text-sm font-semibold">Also Read :</p>
                      <Link
                        href={`/blogs/${post.alsoRead.slug}`}
                        className="mt-1 inline-flex items-start gap-2 text-sm font-medium underline underline-offset-4 hover:text-[#FBC617]"
                      >
                        <span className="mt-1 h-4 w-1 shrink-0 rounded bg-[#FBC617]" />
                        &quot;{post.alsoRead.title}&quot;
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 grid gap-4 border-y border-[#e5e5e5] py-8 sm:grid-cols-3">
              {post.features.map((f) => (
                <div key={f.num} className="px-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FBC617] text-sm font-bold text-[#1a1a1a]">
                    {f.num}
                  </span>
                  <h3 className="mt-3 font-bold text-[#1a1a1a]">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
                    {f.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold text-[#1a1a1a]">
                Tips for an Efficient Shopping Experience
              </h2>
              <ul className="mt-5 space-y-3">
                {post.tips.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-3 text-sm text-[#4b4b4b]"
                  >
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#FBC617]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl bg-[#1E7F57] p-6 text-white sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-4xl">
                👩
              </div>
              <div>
                <p className="text-lg font-bold text-[#FBC617]">
                  {post.author}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/90">
                  Founder &amp; writer at Gulshan Grocery. Passionate about
                  fresh food, smart shopping habits, and helping Dhaka families
                  eat better every day.
                </p>
              </div>
            </div>
          </article>

          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <div>
              <h3 className="font-bold text-[#1a1a1a]">Filter by Categories</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {SIDEBAR_CATEGORIES.map((c) => (
                  <Link
                    key={c}
                    href="/blogs"
                    className="rounded-full border border-[#e5e5e5] px-3 py-1.5 text-xs font-medium text-[#1a1a1a] transition hover:border-[#1E7F57] hover:text-[#1E7F57]"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#1a1a1a]">Table of Content</h3>
              <ul className="mt-4 space-y-3">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-[#6b6b6b] transition hover:text-[#1E7F57]"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl bg-linear-to-b from-[#1E7F57] to-[#0f5c3d] p-6 text-center text-white">
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

      <section className="border-t border-[#e5e5e5] bg-[#F9F9F9] py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-[#6b6b6b]">
              Related News &amp; Blogs
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#1a1a1a]">
              Latest Related{" "}
              <span className="text-[#1E7F57]">News &amp; Blogs</span>
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {RELATED.map((r) => (
              <article
                key={r.slug}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
              >
                <Link href={`/blogs/${r.slug}`}>
                  <div
                    className={`relative flex aspect-16/10 items-center justify-center bg-linear-to-br ${r.gradient}`}
                  >
                    <span className="text-5xl">{r.emoji}</span>
                    <span className="absolute bottom-3 left-3 rounded-lg bg-[#FBC617] px-3 py-1 text-xs font-bold text-[#1a1a1a]">
                      {r.category}
                    </span>
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-[#6b6b6b]">
                    <span className="font-medium text-[#1a1a1a]">
                      Jenny Alexander
                    </span>
                    <BadgeCheck size={12} className="text-[#1E7F57]" />
                    <span>•</span>
                    <span>{r.date}</span>
                  </div>
                  <Link href={`/blogs/${r.slug}`}>
                    <h3 className="mt-2 line-clamp-2 font-bold text-[#1a1a1a] transition hover:text-[#1E7F57]">
                      {r.title}
                    </h3>
                  </Link>
                  <Link
                    href={`/blogs/${r.slug}`}
                    className="mt-3 inline-block text-sm font-semibold text-[#1E7F57] underline underline-offset-4"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e5e5e5] py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBC617] text-white">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">Free Shipping</h4>
                <p className="text-sm text-[#6b6b6b]">
                  Free shipping for order above ৳500
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBC617] text-white">
                <CreditCard size={28} />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">Flexible Payment</h4>
                <p className="text-sm text-[#6b6b6b]">
                  Multiple secure payment options
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBC617] text-white">
                <Headphones size={28} />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">24x7 Support</h4>
                <p className="text-sm text-[#6b6b6b]">
                  We support online all days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function BlogDetailFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1E7F57] border-t-transparent" />
    </div>
  );
}

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<BlogDetailFallback />}>
      <BlogDetailContent params={params} />
    </Suspense>
  );
}