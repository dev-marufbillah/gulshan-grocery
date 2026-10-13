import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json(
        { error: "You must be logged in to view your orders." },
        { status: 401 }
      );
    }

    await connectDB();

    // 🌟 শুধু লগইন করা ইউজারের ইমেইল দিয়ে ডাটাবেস থেকে অর্ডার খোঁজা হচ্ছে
    const rawOrders = await Order.find({ email: email.trim().toLowerCase() })
      .sort({ createdAt: -1 })
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userOrders = rawOrders.map((o: any) => ({
      id: o.orderId,
      total: o.totalAmount ?? 0,
      paymentMethod: o.paymentMethod ?? "Cash On Delivery",
      status: o.status ?? "Processing",
      dateLabel: o.createdAt
        ? new Date(o.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: o.items ? o.items.map((i: any) => ({
        name: i.name,
        weight: i.weight,
        qty: i.qty,
        emoji: i.emoji,
      })) : [],
    }));

    return NextResponse.json({ success: true, orders: userOrders });
  } catch (err) {
    console.error("Fetch User Orders Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch your orders" },
      { status: 500 }
    );
  }
}