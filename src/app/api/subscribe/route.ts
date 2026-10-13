import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscriber from "@/models/Subscriber";

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();

    // চেক করা হচ্ছে আগে থেকেই সাবস্ক্রাইব করা কিনা
    const existing = await Subscriber.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json({
        success: true,
        message: "You are already subscribed to our newsletter!",
      });
    }

    await Subscriber.create({
      name: name?.trim() || "Valued Customer",
      email: normalizedEmail,
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to weekly newsletter!",
    });
  } catch (err) {
    console.error("Subscribe API Error:", err);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}