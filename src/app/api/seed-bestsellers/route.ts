import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

const data = [
  { name: "Chocolate Ball", slug: "chocolate-ball", category: "snacks", categoryName: "Snacks & Sweets", weight: "500 g", price: 850, oldPrice: 1700, rating: 4.9, emoji: "🍫" },
  { name: "Brown Bread", slug: "brown-bread", category: "bakery", categoryName: "Bakery", weight: "200 g", price: 90, oldPrice: 180, rating: 5.0, emoji: "🍞" },
  { name: "Almond Milk", slug: "almond-milk", category: "milk-eggs", categoryName: "Dairy Products", weight: "500 ml", price: 320, oldPrice: 400, rating: 4.9, emoji: "🥛" },
  { name: "Coconut Oil", slug: "coconut-oil", category: "oil-ghee", categoryName: "Oils", weight: "200 g", price: 450, oldPrice: 560, rating: 4.8, emoji: "🥥" },
  { name: "Pure Honey", slug: "pure-honey", category: "snacks", categoryName: "Snacks & Sweets", weight: "250 g", price: 380, oldPrice: 475, rating: 4.9, emoji: "🍯" },
  { name: "Butter Cookies", slug: "butter-cookies", category: "bakery", categoryName: "Bakery", weight: "300 g", price: 220, oldPrice: 275, rating: 4.7, emoji: "🍪" },
  { name: "Green Tea", slug: "green-tea", category: "tea-coffee", categoryName: "Tea & Coffee", weight: "100 g", price: 260, oldPrice: 325, rating: 4.8, emoji: "🍵" },
  { name: "Peanut Butter", slug: "peanut-butter", category: "snacks", categoryName: "Spreads", weight: "340 g", price: 420, oldPrice: 525, rating: 4.7, emoji: "🥜" },
];

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  try {
    await connectDB();

    await Product.deleteMany({ slug: { $in: data.map((d) => d.slug) } });

    const inserted = await Product.insertMany(
      data.map((d, i) => ({
        ...d,
        order: i,
        featured: false,
        isDeal: false,
        isBestSeller: true,
        stock: 100,
      }))
    );

    const total = await Product.countDocuments({ isBestSeller: true });

    return NextResponse.json({
      ok: true,
      inserted: inserted.length,
      totalBestSellersInDatabase: total,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}