import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscriber from "@/models/Subscriber";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await Subscriber.updateOne(
      { email },
      { $setOnInsert: { email } },
      { upsert: true }
    );

    const alreadyJoined = result.upsertedCount === 0;

    return NextResponse.json({
      ok: true,
      message: alreadyJoined
        ? "You are already subscribed. Thank you!"
        : "Thanks for subscribing! Your 25% off offer is on its way.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}