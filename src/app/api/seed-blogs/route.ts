import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Blog"
const data = [
  {
    title: "How to Create a Grocery Shopping List: Stay Organized and Save Money",
    slug: "how-to-create-a-grocery-shopping-list",
    category: "Shopping Tips",
    author: "Jenny Alexander",
    publishedAt: new Date("2026-10-05"),
    emoji: "🛒",
  },
  {
    title: "Summer Produce Guide: Fresh Fruits and Vegetables to Enjoy",
    slug: "summer-produce-guide",
    category: "Seasonal Guides",
    author: "Jenny Alexander",
    publishedAt: new Date("2026-10-03"),
    emoji: "🍉",
  },
  {
    title: "Top 10 Superfoods for a Balanced Diet: Boost Your Health Naturally",
    slug: "top-10-superfoods-for-a-balanced-diet",
    category: "Healthy Eating",
    author: "Jenny Alexander",
    publishedAt: new Date("2026-09-28"),
    emoji: "🥑",
  },
];

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  try {
    await connectDB();

    await Blog.deleteMany({});

    const inserted = await Blog.insertMany(
      data.map((d, i) => ({ ...d, order: i }))
    );
    const total = await Blog.countDocuments({});

    return NextResponse.json({
      ok: true,
      inserted: inserted.length,
      totalBlogsInDatabase: total,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}