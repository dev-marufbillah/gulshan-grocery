import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Pore chobi dile path likho, jemon "/images/weekly-basket.png"
const IMAGE: string | null = null;

export default function WeeklyBanner() {
  return (
    <section className="bg-white pb-14 md:pb-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative flex min-h-[280px] items-center overflow-hidden rounded-xl bg-[#1E7F57] p-8 md:p-12">
          <div className="relative z-10 max-w-[60%] md:max-w-[50%]">
            <p className="text-base font-medium text-[#FBC617]">Weekly Deals</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-4xl">
              Unbeatable Offers: Your
              <br />
              <span className="text-[#FBC617]">Weekly Grocery Specials</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm text-white/85">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FBC617] px-7 py-3 text-sm font-semibold text-[#1a1a1a] transition hover:bg-[#f0bb0a]"
            >
              Shop Now
              <ArrowRight size={18} />
            </Link>
          </div>

          {IMAGE ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={IMAGE}
              alt="Weekly grocery basket"
              className="absolute bottom-0 right-0 h-[95%] w-auto object-contain object-bottom"
            />
          ) : (
            <div className="absolute bottom-3 right-4 flex items-end gap-1 md:right-10">
              <span className="text-6xl md:text-7xl">🥖</span>
              <span className="text-[90px] leading-none md:text-[130px]">🧺</span>
              <span className="text-6xl md:text-7xl">🥚</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}