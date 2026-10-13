import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SectionSettings from "@/models/SectionSettings";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDB();
    const settings = await SectionSettings.findOne().lean();
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
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

    const body = await req.json();
    await connectDB();

    let settings = await SectionSettings.findOne();
    if (settings) {
      settings.faq = body.faq;
      settings.gallery = body.gallery;
      settings.promoBanners = body.promoBanners; // 🌟 Save Promo Banners
      await settings.save();
    } else {
      settings = await SectionSettings.create(body);
    }

    return NextResponse.json({ success: true, message: "Settings Updated!" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}