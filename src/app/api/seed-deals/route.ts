import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

const data = [
  {
    name: "Laundry Detergent",
    slug: "laundry-detergent",
    category: "house-hold",
    categoryName: "Laundry Supplies",
    weight: "2 L",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    price: 750,
    oldPrice: 1000,
    rating: 4.9,
    emoji: "🧴",
  },
  {
    name: "Body Wash",
    slug: "body-wash",
    category: "personal-care",
    categoryName: "Personal Care",
    weight: "500 ml",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
    price: 250,
    oldPrice: 500,
    rating: 5.0,
    emoji: "🧼",
  },
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
        isDeal: true,
        stock: 100,
      }))
    );

    const totalDeals = await Product.countDocuments({ isDeal: true });

    return NextResponse.json({
      ok: true,
      inserted: inserted.length,
      totalDealsInDatabase: totalDeals,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}