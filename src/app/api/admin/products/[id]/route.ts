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