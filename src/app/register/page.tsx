import Link from "next/link";
import RegisterClient from "@/components/RegisterClient";

export const metadata = { title: "Register | Gulshan Grocery" };

export default function RegisterPage() {
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
        <h1 className="text-4xl font-bold text-[#1a1a1a]">Create Account</h1>
        <p className="mt-3 text-sm font-medium text-[#6b6b6b]">
          <Link href="/" className="hover:text-[#1E7F57]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#1E7F57]">Register</span>
        </p>
      </section>

      {/* Form Component */}
      <RegisterClient />
    </main>
  );
}