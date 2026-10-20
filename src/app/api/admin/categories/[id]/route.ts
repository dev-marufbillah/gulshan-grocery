/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import * as dbModule from "@/lib/db";
import Category from "@/models/Category";

async function getDbConnection() {
  const db = dbModule as any;
  const connectFn = db.default || db.connectDB || db.connectToDatabase || db.connectMongoDB || db.dbConnect;
  if (typeof connectFn === "function") await connectFn();
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getDbConnection();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (err: any) {
    console.error("DELETE /api/admin/categories/[id] Error:", err);
    return NextResponse.json({ error: err?.message || "Failed to delete category" }, { status: 500 });
  }
}