import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    const email = "marufsalauddinofficial@gmail.com";
    const password = "AdminPassword@123";

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Mongoose Warning Fix: returnDocument: 'after'
    const user = await User.findOneAndUpdate(
      { email },
      {
        name: "Maruf Salauddin",
        email: email,
        password: hashedPassword,
        role: "superadmin",
      },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json({
      success: true,
      message: "Super Admin Account Created / Reset Successfully!",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Seed Admin Error:", err);
    return NextResponse.json({ error: "Failed to seed admin" }, { status: 500 });
  }
}