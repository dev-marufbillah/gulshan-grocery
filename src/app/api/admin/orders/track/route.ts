import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    const { orderId, email } = await req.json();

    if (!orderId || !email) {
      return NextResponse.json(
        { error: "Order ID and Email are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 🌟 ডাটাবেসে Order ID এবং Email দিয়ে রিয়েল অর্ডার খোঁজা হচ্ছে
    const order = await Order.findOne({
      orderId: orderId.trim(),
      email: email.trim().toLowerCase(),
    }).lean();

    if (!order) {
      return NextResponse.json(
        { error: "No order found with this ID and Email combination." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _id: (order as any)._id.toString(),
      },
    });
  } catch (err) {
    console.error("Track Order API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}