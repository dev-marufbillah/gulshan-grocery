"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterClient() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // ডেমো সাবমিট (২ সেকেন্ড পর My Account এ নিয়ে যাবে)
    setTimeout(() => {
      setLoading(false);
      alert("Account created successfully!");
      router.push("/account");
    }, 2000);
  };

  const inputCls =
    "w-full rounded-full border border-[#e5e5e5] px-5 py-3.5 text-sm outline-none transition focus:border-[#1E7F57]";

  return (
    <section className="mx-auto max-w-xl px-4 py-16 md:px-6">
      <div className="rounded-3xl border border-[#e5e5e5] bg-white p-6 shadow-sm md:p-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Register</h2>
          <p className="mt-2 text-sm text-[#6b6b6b]">
            Create an account to get 25% off on your first order.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                First Name <span className="text-red-500">*</span>
              </label>
              <input required type="text" placeholder="Ex. John" className={inputCls} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input required type="text" placeholder="Ex. Doe" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input required type="email" placeholder="example@gmail.com" className={inputCls} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                required
                type={showPass ? "text" : "password"}
                placeholder="Enter Password"
                className={`${inputCls} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E7F57]"
              >
                {showPass ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                required
                type={showConfPass ? "text" : "password"}
                placeholder="Confirm Password"
                className={`${inputCls} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowConfPass(!showConfPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E7F57]"
              >
                {showConfPass ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 pt-2">
            <input type="checkbox" required className="h-4 w-4 cursor-pointer rounded accent-[#1E7F57]" />
            <span className="text-sm font-medium text-[#1a1a1a]">
              I agree to the{" "}
              <Link href="/terms" className="text-[#1E7F57] hover:underline">Terms &amp; Conditions</Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-full bg-[#1E7F57] py-3.5 text-sm font-bold text-white transition hover:bg-[#166b48] disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-[#6b6b6b]">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#1E7F57] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}