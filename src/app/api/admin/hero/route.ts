import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import HeroSetting from "@/models/HeroSetting";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDB();
    const settings = await HeroSetting.findOne().lean();
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load hero settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    // @ts-expect-error session role
    const role = session?.user?.role;

    if (role !== "superadmin" && role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { slides } = await req.json();
    await connectDB();

    let settings = await HeroSetting.findOne();
    if (settings) {
      settings.slides = slides;
      await settings.save();
    } else {
      settings = await HeroSetting.create({ slides });
    }

    return NextResponse.json({ success: true, message: "Hero Settings Updated!" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}