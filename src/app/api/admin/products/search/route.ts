import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

type LeanSearchProduct = {
  _id: { toString(): string };
  name?: string;
  slug?: string;
  price?: number;
  image?: string;
  emoji?: string;
  categoryName?: string;
  weight?: string;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ success: true, products: [] });
    }

    await connectDB();

    const rawProducts = await Product.find({
      name: { $regex: query, $options: "i" },
    })
      .limit(5)
      .select("name slug price image emoji categoryName weight")
      .lean<LeanSearchProduct[]>();

    const formatted = rawProducts.map((p) => ({
      _id: p._id.toString(),
      name: p.name ?? "",
      slug: p.slug ?? "",
      price: p.price ?? 0,
      image: p.image ?? "",
      emoji: p.emoji ?? "🛒",
      categoryName: p.categoryName ?? "",
      weight: p.weight ?? "",
    }));

    return NextResponse.json({ success: true, products: formatted });
  } catch (err) {
    console.error("Search API Error:", err);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}