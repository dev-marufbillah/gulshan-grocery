import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order"; // Default import

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find({ userEmail: session.user.email }).sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: unknown) {
    console.error("Fetch orders error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}