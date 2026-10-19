import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({
      $or: [
        { isOffer: true },
        { oldPrice: { $gt: 0 } }
      ]
    })
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    return NextResponse.json(
      { success: true, products: products || [] },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json(
      { success: false, products: [], error: "Failed to fetch offers" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}