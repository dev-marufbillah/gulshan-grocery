import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon | Gulshan Grocery",
  description: "Get notified when Gulshan Grocery launches",
};

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Root layout-এর Header / Newsletter / Footer দেখাবে না
  return <>{children}</>;
}