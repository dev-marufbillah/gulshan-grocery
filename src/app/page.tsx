import { Suspense } from "react";
import { connection } from "next/server";
import Hero from "@/components/Hero";
import CategoryRow from "@/components/CategoryRow";
import PromoBanners from "@/components/PromoBanners";
import FeaturedProducts from "@/components/FeaturedProducts";
import BestSellers from "@/components/BestSellers";
import TodayDeals from "@/components/TodayDeals";
import Testimonials from "@/components/Testimonials";
import LatestBlogs from "@/components/LatestBlogs";
import PhotoStrip from "@/components/PhotoStrip";
import Features from "@/components/Features";
import Faq from "@/components/Faq";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import User from "@/models/User";
import HeroSetting from "@/models/HeroSetting";
import SectionSettings from "@/models/SectionSettings";
import { ProductItem } from "@/components/ProductCard";

export const metadata = {
  title: "Gulshan Grocery | Fresh Grocery Delivery in Gulshan, Dhaka",
};

type LeanHomeProduct = {
  _id: { toString(): string };
  slug?: string;
  name?: string;
  categoryName?: string;
  weight?: string;
  price?: number;
  oldPrice?: number;
  rating?: number;
  image?: string;
  emoji?: string;
  stock?: number;
};

type LeanHomeCategory = {
  _id: { toString(): string };
  name: string;
  slug: string;
  icon?: string;
  productCount?: number;
};

async function HomeContent() {
  await connection();
  await connectDB();

  // Fetch Live Data from DB
  const [rawProducts, rawCategories, userCount, ratingAgg, rawHeroData, rawSectionData] =
    await Promise.all([
      Product.find({}).sort({ createdAt: -1 }).lean<LeanHomeProduct[]>(),
      Category.find({ featured: true }).sort({ order: 1 }).lean<LeanHomeCategory[]>(),
      User.countDocuments({ role: "user" }),
      Product.aggregate([
        { $match: { rating: { $gt: 0 } } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]),
      HeroSetting.findOne().lean<Record<string, unknown>>(),
      SectionSettings.findOne().lean<Record<string, unknown>>(),
    ]);

  // Formatted Products
  const products: ProductItem[] = rawProducts.map((p) => ({
    id: p._id.toString(),
    slug: p.slug ?? "",
    name: p.name ?? "",
    categoryName: p.categoryName ?? "",
    weight: p.weight ?? "500 g",
    price: p.price ?? 0,
    oldPrice: p.oldPrice ?? 0,
    rating: p.rating ?? 5.0,
    image: p.image ?? "",
    emoji: p.emoji ?? "🛒",
    stock: p.stock ?? 100,
  }));

  const categories = rawCategories.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    slug: c.slug,
    icon: c.icon || "🛒",
    count: c.productCount ?? 0,
  }));

  // Clean Hero Slides
  const heroDataObj = rawHeroData as {
    slides?: Array<{
      badge?: string;
      titlePart1?: string;
      titlePart2?: string;
      description?: string;
      image?: string;
    }>;
  };

  const slides = heroDataObj?.slides?.length
    ? heroDataObj.slides.map((s) => ({
        badge: s.badge ?? "",
        titlePart1: s.titlePart1 ?? "",
        titlePart2: s.titlePart2 ?? "",
        description: s.description ?? "",
        image: s.image ?? "",
      }))
    : null;

  // Clean Section Settings
  const sectionData = rawSectionData
    ? JSON.parse(JSON.stringify(rawSectionData))
    : null;

  const featuredProducts = products.filter((p) => p.price > 0).slice(0, 8);
  const bestSellers = products.slice(0, 4);

  const avgRating = ratingAgg[0]?.avgRating
    ? Number(ratingAgg[0].avgRating.toFixed(1))
    : 5.0;
  const formattedUsers =
    userCount > 999 ? (userCount / 1000).toFixed(1) + "k" : userCount.toString();

  return (
    <>
      <Hero
        avgRating={avgRating}
        customerCount={formattedUsers}
        customSlides={slides}
      />
      <CategoryRow categories={categories} />
      <PromoBanners data={sectionData?.promoBanners} />
      <FeaturedProducts products={featuredProducts} />
      <TodayDeals />
      <BestSellers products={bestSellers} />
      <Testimonials />
      <LatestBlogs />
      <Faq data={sectionData?.faq} />
      <PhotoStrip data={sectionData?.gallery} />
      <Features />
    </>
  );
}

function HomeSkeleton() {
  return (
    <div className="space-y-10 py-10">
      <div className="mx-auto h-96 max-w-7xl animate-pulse rounded-3xl bg-[#F4F4F4]" />
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}