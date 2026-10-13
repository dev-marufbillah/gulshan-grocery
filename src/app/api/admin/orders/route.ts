import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@/auth";

type LeanOrder = {
  _id: { toString(): string };
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: { name: string; qty: number }[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt?: Date | string;
};

export async function GET() {
  try {
    const session = await auth();
    // @ts-expect-error session role
    const role = session?.user?.role;

    if (role !== "superadmin" && role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    await connectDB();

    const rawOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean<LeanOrder[]>();

    const orders = rawOrders.map((o) => ({
      _id: o._id.toString(),
      orderId: o.orderId,
      customerName: o.customerName ?? "Customer",
      email: o.email ?? "",
      phone: o.phone ?? "",
      address: o.address ?? "",
      itemsSummary: o.items ? o.items.map((i) => `${i.name} x${i.qty}`).join(", ") : "",
      totalAmount: o.totalAmount ?? 0,
      paymentMethod: o.paymentMethod ?? "Cash",
      status: o.status ?? "Accepted",
      createdAt: o.createdAt
        ? new Date(o.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A",
    }));

    return NextResponse.json({ success: true, orders });
  } catch (err) {
    console.error("GET Admin Orders Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}