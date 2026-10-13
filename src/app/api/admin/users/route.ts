import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic"; // ✅ Fix Prerendering Warning

type LeanUser = {
  _id: { toString(): string };
  name?: string;
  email?: string;
  role?: string;
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

    const rawUsers = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean<LeanUser[]>();

    const formattedUsers = rawUsers.map((u) => ({
      _id: u._id.toString(),
      name: u.name ?? "Anonymous",
      email: u.email ?? "",
      role: u.role ?? "user",
      createdAt: u.createdAt
        ? new Date(u.createdAt).toLocaleDateString("en-GB")
        : "N/A",
    }));

    return NextResponse.json({ success: true, users: formattedUsers });
  } catch (err) {
    console.error("Get Users Error:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}