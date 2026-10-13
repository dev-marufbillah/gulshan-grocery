"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginClient() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // ডেমো সাবমিট (লগিন সাকসেস হলে My Account এ যাবে)
    setTimeout(() => {
      setLoading(false);
      router.push("/account");
    }, 1500);
  };

  const inputCls =
    "w-full rounded-full border border-[#e5e5e5] px-5 py-3.5 text-sm outline-none transition focus:border-[#1E7F57]";

  return (
    <section className="mx-auto max-w-lg px-4 py-16 md:px-6">
      <div className="rounded-3xl border border-[#e5e5e5] bg-white p-6 shadow-sm md:p-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Welcome Back!</h2>
          <p className="mt-2 text-sm text-[#6b6b6b]">
            Please enter your details to sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="flex items-center justify-between pt-2">
            <label className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" className="h-4 w-4 cursor-pointer rounded accent-[#1E7F57]" />
              <span className="text-sm font-medium text-[#1a1a1a]">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm font-semibold text-[#1E7F57] hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-full bg-[#1E7F57] py-3.5 text-sm font-bold text-white transition hover:bg-[#166b48] disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-[#6b6b6b]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-[#1E7F57] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
}