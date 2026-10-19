import Link from "next/link";
import AccountClient from "@/components/AccountClient";
import { ShieldCheck, CreditCard, Headphones } from "lucide-react";

export const metadata = { title: "My Account | Gulshan Grocery" };

export default function AccountPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Banner */}
      <section
        className="relative bg-[#F9F9F9] py-8 sm:py-14 text-center border-b border-[#e5e5e5]"
        style={{
          backgroundImage: "radial-gradient(#d9d9d9 1px, transparent 1px)",
          backgroundSize: "24px 28px",
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#1a1a1a]">My Account</h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-[#6b6b6b]">
            <Link href="/" className="hover:text-[#1E7F57] transition-colors">
              Home
            </Link>
            <span className="mx-2 text-[#9a9a9a]">/</span>
            <span className="text-[#1E7F57]">My Account</span>
          </p>
        </div>
      </section>

      {/* Dynamic Account Client Content */}
      <AccountClient />

      {/* Features */}
      <section className="border-t border-[#e5e5e5] py-8 sm:py-12 bg-[#FAF9F6]">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
            
            {/* Feature 1 */}
            <div className="flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#ececec] shadow-2xs">
              <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-[#FBC617] text-white shadow-xs">
                <ShieldCheck size={24} className="sm:w-7 sm:h-7" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-base text-[#1a1a1a]">Free Shipping</h4>
                <p className="text-[11px] sm:text-sm text-[#6b6b6b] mt-0.5">
                  Free shipping for order above ৳500
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#ececec] shadow-2xs">
              <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-[#FBC617] text-white shadow-xs">
                <CreditCard size={24} className="sm:w-7 sm:h-7" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-base text-[#1a1a1a]">Flexible Payment</h4>
                <p className="text-[11px] sm:text-sm text-[#6b6b6b] mt-0.5">
                  Multiple secure payment options
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#ececec] shadow-2xs">
              <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-[#FBC617] text-white shadow-xs">
                <Headphones size={24} className="sm:w-7 sm:h-7" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-base text-[#1a1a1a]">24x7 Support</h4>
                <p className="text-sm sm:text-sm text-[#6b6b6b] mt-0.5">
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