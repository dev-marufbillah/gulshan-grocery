/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import * as dbModule from "@/lib/db";
import Product from "@/models/Product";

async function getDbConnection() {
  const db = dbModule as any;
  const connectFn =
    db.default ||
    db.connectDB ||
    db.connectToDatabase ||
    db.connectMongoDB ||
    db.dbConnect;
  if (typeof connectFn === "function") await connectFn();
}

// 1. GET: একটি নির্দিষ্ট প্রোডাক্টের ডাটা ফেচ করার জন্য (Fixes: 405 Method Not Allowed)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getDbConnection();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (err: any) {
    console.error("GET product error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// 2. PUT: এডিট করার পর ডাটা ডাটাবেজে আপডেট করার জন্য
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getDbConnection();
    const { id } = await params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID required" },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (err: any) {
    console.error("PUT product error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// 3. DELETE: প্রোডাক্ট ডিলিট করার জন্য
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getDbConnection();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID required" },
        { status: 400 }
      );
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err: any) {
    console.error("DELETE product error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}