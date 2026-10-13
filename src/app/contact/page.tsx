import Link from "next/link";
import ContactClient from "@/components/ContactClient";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
  Headphones,
} from "lucide-react";

export const metadata = { title: "Contact Us | Gulshan Grocery" };

export default function ContactPage() {
  return (
    <main className="bg-white">
      {/* Banner */}
      <section
        className="relative bg-[#F9F9F9] py-14 text-center"
        style={{
          backgroundImage: "radial-gradient(#d9d9d9 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      >
        <h1 className="text-4xl font-bold text-[#1a1a1a]">Contact Us</h1>
        <p className="mt-3 text-sm font-medium text-[#6b6b6b]">
          <Link href="/" className="hover:text-[#1E7F57]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#1E7F57]">Contact Us</span>
        </p>
      </section>

      {/* Client Form */}
      <ContactClient />

      {/* Info Cards */}
      <section className="mx-auto max-w-7xl px-4 pb-6 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[#e5e5e5] bg-white px-6 py-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#FBC617] text-[#1a1a1a]">
              <MapPin size={26} />
            </div>
            <h3 className="mt-5 text-lg font-bold text-[#1a1a1a]">Address</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
              Gulshan 1, Road 54,
              <br />
              Dhaka 1212, Bangladesh
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e5e5] bg-white px-6 py-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#FBC617] text-[#1a1a1a]">
              <Phone size={26} />
            </div>
            <h3 className="mt-5 text-lg font-bold text-[#1a1a1a]">Phone</h3>
            <p className="mt-2 text-sm text-[#6b6b6b]">+880 1700-000000</p>
          </div>

          <div className="rounded-2xl border border-[#e5e5e5] bg-white px-6 py-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#FBC617] text-[#1a1a1a]">
              <Mail size={26} />
            </div>
            <h3 className="mt-5 text-lg font-bold text-[#1a1a1a]">Email</h3>
            <p className="mt-2 text-sm text-[#6b6b6b]">
              support@gulshangrocery.com
            </p>
          </div>
        </div>
      </section>

      {/* ✅ Tailwind classes fixed here: h-85, md:h-105, border-l-10, border-r-10, border-t-14 */}
      <section className="relative mt-10 h-85 w-full overflow-hidden bg-[#eef2f0] md:h-105">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(#d7ddd9 1px, transparent 1px), linear-gradient(90deg, #d7ddd9 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.55),transparent_65%)]" />

        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1E7F57] text-2xl text-white shadow-lg ring-4 ring-white">
              🛒
            </div>
            <div className="mx-auto -mt-1 h-0 w-0 border-l-10 border-r-10 border-t-14 border-l-transparent border-r-transparent border-t-[#1E7F57]" />
          </div>
          <p className="mt-3 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#1a1a1a] shadow">
            Gulshan Grocery
          </p>
        </div>
      </section>

      {/* Features */}
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