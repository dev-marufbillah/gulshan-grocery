import { connection } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/auth";

type LeanUser = {
  _id: { toString(): string };
  name?: string;
  email: string;
  role?: string;
  createdAt?: Date;
};

export async function GET() {
  await connection();
  try {
    const session = await auth();
    // @ts-expect-error session role
    const role = session?.user?.role;

    if (role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const rawUsers = await User.find({})
      .select("_id name email role createdAt")
      .sort({ createdAt: -1 })
      .lean<LeanUser[]>();

    const users = rawUsers.map((u) => ({
      ...u,
      _id: u._id.toString(),
    }));

    return Response.json({ users });
  } catch (error) {
    console.error("Get Users Error:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}