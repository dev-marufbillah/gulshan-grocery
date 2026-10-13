import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, category, price, oldPrice, weight, stock, image, description } = body;

    if (!name || !slug || !category || !price || !weight) {
      return NextResponse.json(
        { error: "Required fields are missing!" },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await Product.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A product with this slug already exists!" },
        { status: 400 }
      );
    }

    const categoryNames: Record<string, string> = {
      "fresh-fruits": "Fruits",
      vegetables: "Vegetables",
      drinks: "Beverages",
      snacks: "Snacks & Sweets",
    };

    // 🌟 ছবি না থাকলে ডিফল্ট হাই-কোয়ালিটি গ্রোসারি ইমেজ সেট হবে
    const defaultPlaceholder = "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=80";

    const newProduct = await Product.create({
      name,
      slug,
      category,
      categoryName: categoryNames[category] || category,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : 0,
      weight,
      stock: Number(stock) || 100,
      image: image && image.trim() !== "" ? image : defaultPlaceholder,
      emoji: "🛒",
      description: description || "",
      rating: 5.0,
      featured: true,
    });

    return NextResponse.json({
      success: true,
      message: "Product created successfully!",
      product: newProduct,
    });
  } catch (err) {
    console.error("Create Product Error:", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}