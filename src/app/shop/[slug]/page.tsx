import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { connection } from "next/server";
import mongoose from "mongoose";
import { ShieldCheck, CreditCard, Headphones } from "lucide-react";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductDetailsClient, {
  type ProductDetailsData,
} from "@/components/ProductDetailsClient";

type LeanProduct = {
  _id: { toString(): string };
  name: string;
  slug?: string;
  categoryName?: string;
  category?: string;
  weight?: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  description?: string;
  emoji?: string;
  image?: string;
  stock?: number;
  brand?: string;
  productType?: string;
};

async function ProductDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug || slug === "undefined" || slug === "null") {
    notFound();
  }

  await connectDB();

  const isObjectId = mongoose.Types.ObjectId.isValid(slug);

  const rawProduct = await Product.findOne({
    $or: [
      { slug: slug },
      ...(isObjectId ? [{ _id: slug }] : []),
    ],
  })
    .select("-createdAt -updatedAt")
    .lean<LeanProduct | null>();

  if (!rawProduct) notFound();

  const product: ProductDetailsData = {
    _id: rawProduct._id.toString(),
    name: rawProduct.name ?? "",
    slug: rawProduct.slug || rawProduct._id.toString(),
    categoryName: rawProduct.categoryName ?? "Grocery",
    category: rawProduct.category ?? "",
    weight: rawProduct.weight ?? "",
    price: rawProduct.price ?? 0,
    oldPrice: rawProduct.oldPrice ?? 0,
    rating: rawProduct.rating ?? 5,
    description: rawProduct.description ?? "",
    emoji: rawProduct.emoji ?? "🛒",
    image: rawProduct.image ?? "",
    stock: rawProduct.stock ?? 0,
    brand: rawProduct.brand ?? "",
    productType: rawProduct.productType ?? "",
  };

  return (
    <main className="bg-white">
      <section
        className="relative bg-[#F9F9F9] py-14 text-center"
        style={{
          backgroundImage: "radial-gradient(#d9d9d9 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      >
        <h1 className="text-4xl font-bold text-[#1a1a1a]">Shop</h1>
        <p className="mt-3 text-sm font-medium text-[#6b6b6b]">
          <Link href="/" className="hover:text-[#1E7F57]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[#1E7F57]">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#1E7F57]">{product.name}</span>
        </p>
      </section>

      <ProductDetailsClient product={product} />

      <section className="border-t border-[#e5e5e5] py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBC617] text-white">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">Free Shipping</h4>
                <p className="text-sm text-[#6b6b6b]">
                  Free shipping for order above ৳500
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBC617] text-white">
                <CreditCard size={28} />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">Flexible Payment</h4>
                <p className="text-sm text-[#6b6b6b]">
                  Multiple secure payment options
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBC617] text-white">
                <Headphones size={28} />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">24x7 Support</h4>
                <p className="text-sm text-[#6b6b6b]">
                  We support online all days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1E7F57] border-t-transparent" />
    </div>
  );
}

export default function ShopDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ProductFallback />}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}