import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import NewsletterPopup from "@/components/NewsletterPopup";
import Providers from "@/components/Providers";
import MobileBottomNav from "@/components/MobileBottomNav"; // ✅ নতুন ইমপোর্ট

export const metadata: Metadata = {
  title: "Gulshan Grocery",
  description: "Fresh grocery delivery in Gulshan, Dhaka",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans text-[#1a1a1a] antialiased">
        <Providers>
          {/* গ্লোবাল হেডার */}
          <Header />
          
          {/* 🌟 মোবাইলের জন্য নিচে প্যাডিং (pb-16) দেওয়া হয়েছে যাতে কন্টেন্ট বারের নিচে না ঢোকে */}
          <div className="min-h-screen pb-16 md:pb-0">
            {children}
          </div>

          <Newsletter />
          <Footer />
          <NewsletterPopup />

          {/* 🌟 মোবাইল বটম নেভিগেশন (শুধু মোবাইলে দেখাবে) */}
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}