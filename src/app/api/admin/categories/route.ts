import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({})
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, categories });
  } catch (err) {
    console.error("GET Categories Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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

    const body = await req.json();
    const { name, slug, icon, featured, order } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and Slug are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "Category slug already exists!" },
        { status: 400 }
      );
    }

    // 🌟 Default High Quality Category Placeholder if empty
    const defaultPlaceholder =
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80";

    const newCategory = await Category.create({
      name,
      slug,
      icon: icon && icon.trim() !== "" ? icon : defaultPlaceholder,
      featured: featured ?? true,
      order: order ? Number(order) : 0,
      productCount: 0,
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (err) {
    console.error("Create Category Error:", err);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}