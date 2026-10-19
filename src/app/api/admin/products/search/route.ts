import { connection } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

type LeanSearchProduct = {
  _id: { toString(): string };
  name: string;
  slug: string;
  price: number;
  image?: string;
  emoji?: string;
  categoryName?: string;
  weight?: string;
};

export async function GET(req: Request) {
  await connection();
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query || query.length < 2) {
      return Response.json({ products: [] });
    }

    await connectDB();

    const rawProducts = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { categoryName: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    })
      .select("_id name slug price image emoji categoryName weight")
      .limit(8)
      .lean<LeanSearchProduct[]>();

    const products = rawProducts.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }));

    return Response.json({ products });
  } catch (error) {
    console.error("Search API Error:", error);
    return Response.json({ products: [] }, { status: 500 });
  }
}