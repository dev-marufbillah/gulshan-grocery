import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, products: products || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return NextResponse.json(
      { success: false, products: [], error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();

    const {
      name,
      slug,
      category,
      price,
      oldPrice,
      isOffer,
      weight,
      stock,
      image,
      description,
    } = body;

    const numPrice = Number(price) || 0;
    const numOldPrice = oldPrice ? Number(oldPrice) : null;
    const offerFlag = Boolean(isOffer) || (numOldPrice !== null && numOldPrice > numPrice);

    const newProduct = await Product.create({
      name,
      slug: slug || name?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category,
      price: numPrice,
      oldPrice: numOldPrice,
      isOffer: offerFlag,
      weight: weight || "",
      stock: stock ? Number(stock) : 0,
      image: image || "",
      description: description || "",
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}