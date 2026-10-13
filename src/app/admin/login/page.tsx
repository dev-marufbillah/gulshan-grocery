"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingBasket, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("marufsalauddinofficial@gmail.com");
  const [password, setPassword] = useState("AdminPassword@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password: password.trim(),
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid Email or Password!");
        setLoading(false);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F9F9] p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#e5e5e5] bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center justify-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1E7F57] text-[#FBC617] shadow-md">
            <ShoppingBasket size={28} />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-[#1a1a1a]">
            Admin Secure Login
          </h1>
          <p className="mt-1 text-sm text-[#6b6b6b]">
            Only authorized personnel are allowed.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-[#e5e5e5] px-5 py-3.5 text-sm outline-none transition focus:border-[#1E7F57]"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-full border border-[#e5e5e5] px-5 py-3.5 pr-10 text-sm outline-none transition focus:border-[#1E7F57]"
                placeholder="••••••••"
              />
              <Lock
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c4c4c4]"
              />
            </div>
          </div>

          {error && (
            <p className="text-center text-sm font-bold text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-full bg-[#1E7F57] py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#166b48] disabled:opacity-70"
          >
            {loading ? "Authenticating..." : "Secure Login"}
          </button>
        </form>
      </div>
    </div>
  );
}