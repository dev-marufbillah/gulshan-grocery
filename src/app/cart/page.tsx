import Link from "next/link";
import CartClient from "@/components/CartClient";
import { ShieldCheck, CreditCard, Headphones } from "lucide-react";

export const metadata = { title: "Shopping Cart | Gulshan Grocery" };

export default function CartPage() {
  return (
    <main className="bg-white">
      {/* 1. Page Banner */}
      <section
        className="relative bg-[#F9F9F9] py-14 text-center"
        style={{
          backgroundImage: "radial-gradient(#d9d9d9 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      >
        <h1 className="text-4xl font-bold text-[#1a1a1a]">Shopping Cart</h1>
        <p className="mt-3 text-sm font-medium text-[#6b6b6b]">
          <Link href="/" className="hover:text-[#1E7F57]">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#1E7F57]">Shopping Cart</span>
        </p>
      </section>

      {/* 2. Cart Content */}
      <CartClient />

      {/* 3. Features Section */}
      <section className="border-t border-[#e5e5e5] py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBC617] text-white">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">Free Shipping</h4>
                <p className="text-sm text-[#6b6b6b]">Free shipping for order above ৳500</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBC617] text-white">
                <CreditCard size={28} />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">Flexible Payment</h4>
                <p className="text-sm text-[#6b6b6b]">Multiple secure payment options</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBC617] text-white">
                <Headphones size={28} />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">24×7 Support</h4>
                <p className="text-sm text-[#6b6b6b]">We support online all days.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}