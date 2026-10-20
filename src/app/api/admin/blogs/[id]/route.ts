/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import * as dbModule from "@/lib/db";
import * as BlogModule from "@/models/Blog";

const Blog: any = (BlogModule as any).default || (BlogModule as any).Blog || BlogModule;

async function getDbConnection() {
  const db = dbModule as any;
  const connectFn = db.default || db.connectDB || db.connectToDatabase || db.connectMongoDB || db.dbConnect;
  if (typeof connectFn === "function") {
    await connectFn();
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getDbConnection();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    const { title, category, author, image, intro } = body;

    const updateData: any = {};
    if (title) {
      updateData.title = title;
      updateData.slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    if (category) updateData.category = category;
    if (author) updateData.author = author;
    if (image) updateData.image = image;
    if (intro) updateData.intro = intro;

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedBlog) {
      return NextResponse.json({ success: false, message: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, blog: updatedBlog });
  } catch (err: any) {
    console.error("PUT /api/admin/blogs/[id] Error:", err);
    return NextResponse.json({ success: false, message: err?.message || "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await getDbConnection();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (err: any) {
    console.error("DELETE /api/admin/blogs/[id] Error:", err);
    return NextResponse.json({ success: false, message: err?.message || "Failed to delete blog" }, { status: 500 });
  }
}