import Link from "next/link";
import { ArrowRight } from "lucide-react";

type PromoBannerData = {
  show?: boolean;
  banner1?: { badge: string; title: string; description: string; link: string; image: string };
  banner2?: { badge: string; title: string; description: string; link: string; image: string };
};

const DEFAULT_BANNERS = {
  banner1: {
    badge: "Flat 20% Discount",
    title: "Purely Fresh Vegetables",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    link: "/shop?category=vegetables",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
  },
  banner2: {
    badge: "Flat 25% Discount",
    title: "Fresh Fruits, Pure Quality",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    link: "/shop?category=fresh-fruits",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
  },
};

export default function PromoBanners({ data }: { data?: PromoBannerData | null }) {
  if (data && data.show === false) return null; // Admin can hide it

  const b1 = data?.banner1?.title ? data.banner1 : DEFAULT_BANNERS.banner1;
  const b2 = data?.banner2?.title ? data.banner2 : DEFAULT_BANNERS.banner2;

  return (
    <section className="bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Banner 1: Gray Background */}
          <div className="relative overflow-hidden rounded-3xl bg-[#F4F4F4] p-8 md:p-10 flex flex-col justify-between min-h-[280px] group">
            <div className="relative z-10 max-w-[55%]">
              <span className="inline-block rounded-full bg-[#FBC617] px-4 py-1.5 text-xs font-bold text-[#1a1a1a]">
                {b1.badge}
              </span>
              <h3 className="mt-4 text-2xl font-bold leading-tight text-[#1a1a1a] md:text-3xl">
                {b1.title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-[#6b6b6b]">
                {b1.description}
              </p>
              <Link
                href={b1.link}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1E7F57] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#166b48]"
              >
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
            {/* Real HD Image Fit */}
            <div className="absolute right-0 bottom-0 z-0 h-full w-[45%] pointer-events-none transition-transform duration-500 group-hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b1.image} alt="Promo" className="h-full w-full object-cover rounded-l-full" />
            </div>
          </div>

          {/* Banner 2: Yellow Background */}
          <div className="relative overflow-hidden rounded-3xl bg-[#FBC617] p-8 md:p-10 flex flex-col justify-between min-h-[280px] group">
            <div className="relative z-10 max-w-[55%]">
              <span className="inline-block rounded-full bg-white/40 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-[#1a1a1a]">
                {b2.badge}
              </span>
              <h3 className="mt-4 text-2xl font-bold leading-tight text-[#1a1a1a] md:text-3xl">
                {b2.title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-[#1a1a1a]/80">
                {b2.description}
              </p>
              <Link
                href={b2.link}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1E7F57] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#166b48]"
              >
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
            {/* Real HD Image Fit */}
            <div className="absolute right-0 bottom-0 z-0 h-full w-[45%] pointer-events-none transition-transform duration-500 group-hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b2.image} alt="Promo" className="h-full w-full object-cover rounded-tl-full" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}