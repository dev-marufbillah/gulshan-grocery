import { connection } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@/auth";

export async function GET() {
  await connection();
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find({ userEmail: email })
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({ orders });
  } catch (error) {
    console.error("Fetch User Orders Error:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}