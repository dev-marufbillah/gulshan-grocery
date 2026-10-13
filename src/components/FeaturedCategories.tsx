import { connection } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import CategoryRow, { CategoryItem } from "./CategoryRow";

type CategoryDoc = {
  _id: { toString(): string };
  name: string;
  slug: string;
  icon: string;
  productCount: number;
};

export default async function FeaturedCategories() {
  await connection();
  await connectDB();

  const docs = await Category.find({ featured: true })
    .sort({ order: 1 })
    .lean<CategoryDoc[]>();

  const categories: CategoryItem[] = docs.map((d) => ({
    id: d._id.toString(),
    name: d.name,
    slug: d.slug,
    icon: d.icon,
    count: d.productCount,
  }));

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center md:px-6">
        <p className="text-lg text-[#1a1a1a]">Categories</p>
        <h2 className="mt-3 text-3xl font-semibold text-[#1a1a1a] md:text-4xl">
          Featured <span className="text-[#1E7F57]">Categories</span>
        </h2>
      </div>

      <CategoryRow categories={categories} />
    </section>
  );
}