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

    // Force Create / Update Super Admin in MongoDB
    const user = await User.findOneAndUpdate(
      { email },
      {
        name: "Maruf Salauddin",
        email: email,
        password: hashedPassword,
        role: "superadmin",
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Super Admin Account Created / Reset Successfully!",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      credentialsToUse: {
        email: "marufsalauddinofficial@gmail.com",
        password: "AdminPassword@123",
      },
    });
  } catch (err) {
    console.error("Seed Admin Error:", err);
    return NextResponse.json(
      { error: "Failed to seed admin", details: String(err) },
      { status: 500 }
    );
  }
}