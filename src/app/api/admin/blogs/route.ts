/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import * as dbModule from "@/lib/db";
import * as BlogModule from "@/models/Blog";

const Blog: any = (BlogModule as any).default || (BlogModule as any).Blog || BlogModule;

async function getDbConnection() {
  const db = dbModule as any;
  const connectFn = db.default || db.connectDB || db.connectToDatabase || db.connectMongoDB || db.dbConnect;
  if (typeof connectFn === "function") {
    await connectFn();
  }
}

const INITIAL_BLOGS = [
  {
    title: "10 Essential Benefits of Fresh Organic Vegetables",
    slug: "benefits-of-fresh-organic-vegetables",
    category: "Organic Living",
    author: "Gulshan Nutrition Team",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=1000",
    intro: "Discover why switching to organic vegetables from Gulshan Grocery can boost your immune system, improve digestion, and support local farming families."
  },
  {
    title: "How to Pick the Perfect Summer Fruits Every Time",
    slug: "how-to-pick-perfect-summer-fruits",
    category: "Buying Guide",
    author: "Store Freshness Specialist",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=1000",
    intro: "Learn the secret tips for selecting sweet mangos, crisp apples, juicy watermelons, and ripe berries with peak nutrient content."
  },
  {
    title: "Gulshan Grocery's Quality Promise & Farm Direct Sourcing",
    slug: "gulshan-grocery-quality-promise",
    category: "Company News",
    author: "Gulshan Quality Team",
    image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1000",
    intro: "Explore how we partner directly with certified local growers to deliver 100% pure, farm-fresh produce to your doorstep within hours."
  },
  {
    title: "5 Superfoods You Should Include in Your Daily Diet",
    slug: "5-superfoods-for-daily-diet",
    category: "Health & Wellness",
    author: "Dr. Farhana Ahmed",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1000",
    intro: "Simple daily superfoods available at Gulshan Grocery that provide natural vitality, antioxidants, and long-term heart health."
  },
  {
    title: "Weekly Grocery Shopping Tips: Save Money & Eat Healthy",
    slug: "weekly-grocery-shopping-tips",
    category: "Tips & Tricks",
    author: "Smart Saver",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000",
    intro: "Plan your meals, prevent food waste, and maximize your family grocery budget with practical tips from Gulshan Grocery."
  },
  {
    title: "Fresh Bakery Items Every Morning: Our Craft Process",
    slug: "fresh-bakery-items-morning",
    category: "Organic Living",
    author: "Master Baker",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1000",
    intro: "From golden whole-wheat breads to oven-fresh pastries, discover how our bakery team prepares wholesome treats every daybreak."
  },
  {
    title: "Spices That Heal: Authentic Bangladeshi Spices & Their Magic",
    slug: "spices-that-heal",
    category: "Health & Wellness",
    author: "Chef Rafiq",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000",
    intro: "Turmeric, cinnamon, cardamoms, and black cumin — discover the anti-inflammatory and aromatic magic of authentic spices."
  },
  {
    title: "The Refreshing Benefits of Herbal Tea in Daily Life",
    slug: "benefits-of-herbal-tea",
    category: "Health & Wellness",
    author: "Wellness Expert",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=1000",
    intro: "Unwind with natural green teas, chamomile, and lemongrass blends that detoxify your body and calm your mind."
  }
];

export async function GET() {
  try {
    await getDbConnection();

    let blogs = [];
    try {
      if (Blog && typeof Blog.find === "function") {
        blogs = await Blog.find().sort({ createdAt: -1 }).lean();
        if (!blogs || blogs.length === 0) {
          await Blog.insertMany(INITIAL_BLOGS);
          blogs = await Blog.find().sort({ createdAt: -1 }).lean();
        }
      } else {
        blogs = INITIAL_BLOGS as any;
      }
    } catch (dbErr) {
      console.error("DB Query Error, returning initial blogs:", dbErr);
      blogs = INITIAL_BLOGS as any;
    }

    return NextResponse.json({ success: true, blogs });
  } catch (err: any) {
    console.error("GET /api/admin/blogs Error:", err);
    return NextResponse.json({ success: false, blogs: INITIAL_BLOGS });
  }
}

export async function POST(req: Request) {
  try {
    await getDbConnection();
    const body = await req.json();

    const { title, category, author, image, intro } = body;
    if (!title || !intro) {
      return NextResponse.json({ success: false, message: "Title and intro are required" }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newBlog = await Blog.create({
      title,
      slug,
      category: category || "Organic Living",
      author: author || "Gulshan Team",
      image: image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=1000",
      intro
    });

    return NextResponse.json({ success: true, blog: newBlog });
  } catch (err: any) {
    console.error("POST /api/admin/blogs Error:", err);
    return NextResponse.json({ success: false, message: err?.message || "Internal server error" }, { status: 500 });
  }
}