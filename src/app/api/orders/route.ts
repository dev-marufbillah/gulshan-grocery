import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderId,
      customerName,
      email,
      phone,
      address,
      items,
      totalAmount,
      paymentMethod,
    } = body;

    if (!orderId || !items || items.length === 0 || !totalAmount) {
      return NextResponse.json(
        { error: "Order details are missing" },
        { status: 400 }
      );
    }

    await connectDB();

    const newOrder = await Order.create({
      orderId,
      customerName: customerName || "Guest Customer",
      email: email || "customer@example.com",
      phone: phone || "+880 1700-000000",
      address: address || "Gulshan 1, Dhaka",
      items,
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || "Cash On Delivery",
      status: "Accepted",
    });

    return NextResponse.json({
      success: true,
      message: "Order saved in database!",
      order: newOrder,
    });
  } catch (err) {
    console.error("Create Order Error:", err);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}