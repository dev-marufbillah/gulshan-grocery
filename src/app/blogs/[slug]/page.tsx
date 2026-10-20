/* eslint-disable @next/next/no-img-element */
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, CreditCard, Headphones } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

type BlogDetail = {
  slug: string;
  title: string;
  category: string;
  author: string;
  date?: string;
  readTime?: string;
  image: string;
  intro: string;
  sections?: {
    id?: string;
    title: string;
    body: string;
  }[];
  tips?: string[];
};

const FALLBACK = (slug: string): BlogDetail => ({
  slug,
  title: slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" "),
  category: "Organic Food",
  author: "Gulshan Team",
  date: "20 October 2024",
  readTime: "8 min Read",
  image:
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop",
  intro:
    "Switching to organic vegetables is more than just a trend; it is a lifestyle choice that guarantees better health. At Gulshan Grocery, we source the freshest organic produce directly from trusted local farms to ensure you get chemical-free food every day.",
  sections: [
    {
      id: "immunity",
      title: "Boost Your Immune System Naturally",
      body: "Organic vegetables are packed with higher levels of essential vitamins and minerals. Since they are grown in chemical-free soil, the plants develop stronger natural defenses, which translates to more antioxidants for your body.",
    },
    {
      id: "chemicals",
      title: "Zero Harmful Chemicals",
      body: "Conventional farming relies heavily on synthetic pesticides and fertilizers. By choosing organic from Gulshan Grocery, you protect your family from ingesting these harmful residues, ensuring a cleaner, safer diet.",
    },
  ],
  tips: [
    "Wash vegetables just before cooking, not before storing.",
    "Keep fruits and vegetables in separate fridge compartments.",
    "Use airtight containers for maximum crispness.",
  ],
});

async function BlogDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = FALLBACK(slug);
  if (!post) notFound();

  return (
    <main className="bg-white">
      <section className="relative bg-[#F9F9F9] py-14 text-center">
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
        <div className="relative flex aspect-21/9 w-full items-center justify-center overflow-hidden rounded-3xl bg-[#F4F4F4]">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pt-8 text-center md:px-6">
        <span className="inline-block rounded-full bg-[#FBC617] px-4 py-1.5 text-xs font-bold text-[#1a1a1a]">
          {post.category}
        </span>
        <h1 className="mt-5 text-3xl font-bold text-[#1a1a1a] md:text-4xl">
          {post.title}
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[72px_1fr_300px]">
          <aside className="hidden flex-col items-center gap-3 lg:flex">
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E7F57] text-white"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FBC617] text-[#1a1a1a]"
            >
              <FaTwitter size={14} />
            </a>
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1E7F57] text-white"
            >
              <FaLinkedinIn size={14} />
            </a>
          </aside>

          <article className="min-w-0">
            <p className="text-base text-[#4b4b4b]">{post.intro}</p>
            <div className="mt-10 space-y-10">
              {post.sections?.map((sec, i) => (
                <div key={sec.id || i}>
                  <h2 className="text-2xl font-bold text-[#1a1a1a]">
                    {sec.title}
                  </h2>
                  <p className="mt-3 text-base text-[#6b6b6b]">{sec.body}</p>
                </div>
              ))}
            </div>
          </article>
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
                <h4 className="font-bold text-[#1a1a1a]">Quality Guaranteed</h4>
                <p className="text-sm text-[#6b6b6b]">
                  100% fresh products guaranteed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBC617] text-white">
                <CreditCard size={28} />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">Secure Payment</h4>
                <p className="text-sm text-[#6b6b6b]">
                  Pay safely via bKash, Nagad, or Bank
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
                  We are here to assist you anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <BlogDetailContent params={params} />
    </Suspense>
  );
}