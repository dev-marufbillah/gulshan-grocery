import { Suspense } from "react";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import NewsletterPopup from "@/components/NewsletterPopup";
import { Toaster } from "react-hot-toast"; // <-- ইমপোর্ট করা হলো
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <main className="min-h-screen pb-16 md:pb-0">{children}</main>
          <Newsletter />
          <Footer />
          <NewsletterPopup />
          
          {/* টোস্ট নোটিফিকেশন দেখানোর জন্য Toaster যোগ করা হলো */}
          <Toaster position="top-center" reverseOrder={false} />
        </Providers>
      </body>
    </html>
  );
}