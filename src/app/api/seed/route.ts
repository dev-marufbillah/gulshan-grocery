import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

const data = [
  { name: "Vegetables", slug: "vegetables", icon: "🥦", productCount: 52 },
  { name: "Fresh Fruits", slug: "fresh-fruits", icon: "🍎", productCount: 48 },
  { name: "Milk & Eggs", slug: "milk-eggs", icon: "🥛", productCount: 12 },
  { name: "Bakery", slug: "bakery", icon: "🥐", productCount: 62 },
  { name: "House Hold", slug: "house-hold", icon: "🧴", productCount: 25 },
  { name: "Dry Fruits", slug: "dry-fruits", icon: "🌰", productCount: 8 },
  { name: "Drinks", slug: "drinks", icon: "🍹", productCount: 20 },
  { name: "Meat & Fish", slug: "meat-fish", icon: "🐟", productCount: 34 },
  { name: "Snacks", slug: "snacks", icon: "🍿", productCount: 41 },
  { name: "Rice & Grains", slug: "rice-grains", icon: "🌾", productCount: 27 },
  { name: "Spices", slug: "spices", icon: "🌶️", productCount: 36 },
  { name: "Frozen Food", slug: "frozen-food", icon: "🧊", productCount: 19 },
  { name: "Baby Care", slug: "baby-care", icon: "🍼", productCount: 15 },
  { name: "Personal Care", slug: "personal-care", icon: "🧼", productCount: 29 },
  { name: "Oil & Ghee", slug: "oil-ghee", icon: "🫒", productCount: 18 },
  { name: "Tea & Coffee", slug: "tea-coffee", icon: "☕", productCount: 23 },
  { name: "Noodles & Pasta", slug: "noodles-pasta", icon: "🍜", productCount: 21 },
  { name: "Pet Care", slug: "pet-care", icon: "🐾", productCount: 11 },
];

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  await connectDB();

  await Category.bulkWrite(
    data.map((c, i) => ({
      updateOne: {
        filter: { slug: c.slug },
        update: { $set: { ...c, order: i, featured: true } },
        upsert: true,
      },
    }))
  );

  return NextResponse.json({ ok: true, count: data.length });
}