import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { auth } from "@/auth";

// 1. GET SINGLE PRODUCT FOR EDIT
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    let product = null;

    // ১. প্রথমে ObjectId দিয়ে খোঁজা হচ্ছে
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean();
    }

    // ২. না পাওয়া গেলে Slug দিয়ে খোঁজা হচ্ছে
    if (!product) {
      product = await Product.findOne({ slug: id }).lean();
    }

    if (!product) {
      return NextResponse.json(
        { error: "Product not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _id: (product._id as any).toString(),
      },
    });
  } catch (err) {
    console.error("GET Product Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}

// 2. UPDATE PRODUCT (PUT)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    // @ts-expect-error session role
    const role = session?.user?.role;

    if (role !== "superadmin" && role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const {
      name,
      slug,
      category,
      price,
      oldPrice,
      weight,
      stock,
      image,
      description,
    } = body;

    await connectDB();

    const categoryNames: Record<string, string> = {
      "fresh-fruits": "Fruits",
      vegetables: "Vegetables",
      drinks: "Beverages",
      snacks: "Snacks & Sweets",
    };

    let updatedProduct = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          name,
          slug,
          category,
          categoryName: categoryNames[category] || category,
          price: Number(price),
          oldPrice: oldPrice ? Number(oldPrice) : 0,
          weight,
          stock: Number(stock) || 0,
          image: image || "",
          description: description || "",
        },
        { new: true }
      );
    } else {
      updatedProduct = await Product.findOneAndUpdate(
        { slug: id },
        {
          name,
          slug,
          category,
          categoryName: categoryNames[category] || category,
          price: Number(price),
          oldPrice: oldPrice ? Number(oldPrice) : 0,
          weight,
          stock: Number(stock) || 0,
          image: image || "",
          description: description || "",
        },
        { new: true }
      );
    }

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Update Product Error:", err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// 3. DELETE PRODUCT
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    // @ts-expect-error session role
    const role = session?.user?.role;

    if (role !== "superadmin" && role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await connectDB();

    let deletedProduct = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedProduct = await Product.findByIdAndDelete(id);
    } else {
      deletedProduct = await Product.findOneAndDelete({ slug: id });
    }

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (err) {
    console.error("Delete Product Error:", err);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}