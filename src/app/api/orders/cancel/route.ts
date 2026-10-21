import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, reason } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    await connectDB();

    // Check if orderId is valid MongoDB ObjectId or custom string
    const isObjectId = mongoose.Types.ObjectId.isValid(orderId);
    const query = isObjectId
      ? { $or: [{ _id: orderId }, { orderId }] }
      : { orderId };

    const order = await Order.findOne(query);

    if (!order) {
      // Return success for demo orders on the frontend
      return NextResponse.json({
        success: true,
        message: "Cancellation request received for review.",
      });
    }

    if (order.status === "Cancelled") {
      return NextResponse.json({ error: "Order is already cancelled" }, { status: 400 });
    }

    order.status = "Cancel Requested";
    order.cancelReason = reason || "Customer requested cancellation";
    order.cancelRequestedAt = new Date();
    await order.save();

    return NextResponse.json({
      success: true,
      message: "Cancellation request submitted. Admin will review shortly.",
      order,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}