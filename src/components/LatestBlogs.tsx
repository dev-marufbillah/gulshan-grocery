import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function LatestBlogs() {
  const blogs = [
    {
      id: "1",
      slug: "grocery-shopping-list",
      title: "How to Create a Grocery Shopping List: Stay Organized...",
      category: "Shopping Tips",
      author: "Jenny Alexander",
      date: "14 August 2024",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
      activeIcon: true,
    },
    {
      id: "2",
      slug: "summer-produce-guide",
      title: "Summer Produce Guide: Fresh Fruits and Vegetables to Enjoy",
      category: "Seasonal Guides",
      author: "Jenny Alexander",
      date: "13 August 2024",
      image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80",
      activeIcon: false,
    },
    {
      id: "3",
      slug: "top-10-superfoods",
      title: "Top 10 Superfoods for a Balanced Diet: Boost Your Heal...",
      category: "Healthy Eating",
      author: "Jenny Alexander",
      date: "12 August 2024",
      image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=600&q=80",
      activeIcon: false,
    },
  ];

  return (
    <section className="bg-[#F9F9F9] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#6b6b6b]">News &amp; Blogs</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl md:text-5xl">
              Our Latest <span className="text-[#1E7F57]">News &amp; Blogs</span>
            </h2>
          </div>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 rounded-full bg-[#1E7F57] px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#166b48]"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {/* 3 Blog Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b) => (
            <article key={b.id} className="group flex flex-col justify-between">
              <div>
                {/* Image Box */}
                <Link href={`/blogs/${b.slug}`} className="relative block overflow-hidden rounded-2xl bg-white shadow-xs">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.image}
                      alt={b.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Yellow Category Tag on Bottom-Left */}
                    <span className="absolute bottom-3 left-3 rounded-md bg-[#FBC617] px-3 py-1 text-xs font-bold text-[#1a1a1a]">
                      {b.category}
                    </span>

                    {/* Floating Green Arrow Button */}
                    <span
                      className={`absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[#1E7F57] text-white shadow-lg transition-all duration-300 group-hover:scale-110 ${
                        b.activeIcon ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </Link>

                {/* Author & Date Row */}
                <div className="mt-4 flex items-center gap-2 text-xs text-[#6b6b6b]">
                  <span className="font-medium text-[#6b6b6b]">{b.author}</span>
                  <span className="text-[#1E7F57] font-bold">•</span>
                  <span>{b.date}</span>
                </div>

                {/* Post Title */}
                <Link href={`/blogs/${b.slug}`}>
                  <h3 className="mt-2 line-clamp-2 text-base font-bold text-[#1a1a1a] leading-snug transition-colors group-hover:text-[#1E7F57]">
                    {b.title}
                  </h3>
                </Link>
              </div>

              {/* Read More Link */}
              <div className="mt-3">
                <Link
                  href={`/blogs/${b.slug}`}
                  className="inline-block text-xs font-bold text-[#1E7F57] underline underline-offset-4 hover:text-[#166b48]"
                >
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}