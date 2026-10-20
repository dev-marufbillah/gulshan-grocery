import { Suspense } from "react";
import type { Metadata } from "next";
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

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

async function findProduct(slug: string) {
  await connectDB();
  const isObjectId = mongoose.Types.ObjectId.isValid(slug);
  return Product.findOne({
    $or: [{ slug: slug }, ...(isObjectId ? [{ _id: slug }] : [])],
  })
    .select("-createdAt -updatedAt")
    .lean<LeanProduct | null>();
}

// Social media (Facebook, WhatsApp, Messenger, Twitter/X, LinkedIn) share preview
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  await connection();
  const { slug } = await params;

  if (!slug || slug === "undefined" || slug === "null") {
    return { title: "Product Not Found" };
  }

  const p = await findProduct(slug);
  if (!p) return { title: "Product Not Found" };

  const productSlug = p.slug || p._id.toString();
  const title = p.name;
  const description =
    (p.description || "").replace(/\s+/g, " ").trim().slice(0, 160) ||
    `Buy ${p.name} online at ৳${p.price}`;
  const url = `${SITE_URL}/product/${productSlug}`;

  const imageUrl = p.image
    ? p.image.startsWith("http")
      ? p.image
      : `${SITE_URL}${p.image.startsWith("/") ? "" : "/"}${p.image}`
    : "";

  return {
    title,
    description,
    alternates: SITE_URL ? { canonical: url } : undefined,
    openGraph: {
      type: "website",
      title,
      description,
      url: SITE_URL ? url : undefined,
      images: imageUrl ? [{ url: imageUrl, alt: p.name }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

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

  const rawProduct = await findProduct(slug);

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
      {/* Breadcrumb Banner */}
      <section
        className="relative bg-[#F9F9F9] py-14 text-center"
        style={{
          backgroundImage: "radial-gradient(#d9d9d9 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      >
        <h1 className="text-4xl font-bold text-[#1a1a1a]">Product Details</h1>
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

      {/* Main Details */}
      <ProductDetailsClient product={product} />

      {/* Features Section */}
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

export default function ProductDetailPage({
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