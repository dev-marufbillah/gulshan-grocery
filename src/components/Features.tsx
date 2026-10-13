import { ShieldCheck, CreditCard, Headphones } from "lucide-react";

export default function Features() {
  return (
    <section className="bg-white py-12 border-t border-[#e5e5e5]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FBC617] text-white">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 className="font-bold text-[#1a1a1a]">Free Shipping</h4>
              <p className="text-xs text-[#6b6b6b] sm:text-sm">Free shipping for order above ৳500</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FBC617] text-white">
              <CreditCard size={28} />
            </div>
            <div>
              <h4 className="font-bold text-[#1a1a1a]">Flexible Payment</h4>
              <p className="text-xs text-[#6b6b6b] sm:text-sm">Multiple secure payment options</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FBC617] text-white">
              <Headphones size={28} />
            </div>
            <div>
              <h4 className="font-bold text-[#1a1a1a]">24×7 Support</h4>
              <p className="text-xs text-[#6b6b6b] sm:text-sm">We support online all days.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}