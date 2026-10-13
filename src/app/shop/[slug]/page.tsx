import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { connection } from "next/server";
import {
  Star,
  ShieldCheck,
  CreditCard,
  Headphones,
  Heart,
  ShoppingBag,
} from "lucide-react";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductDetailsClient, {
  type ProductDetailsData,
} from "@/components/ProductDetailsClient";

type LeanProduct = {
  _id: { toString(): string };
  name: string;
  slug: string;
  categoryName: string;
  category: string;
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

type RelatedProduct = {
  _id: string;
  name: string;
  slug: string;
  categoryName: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  emoji?: string;
  image?: string;
  weight?: string;
};

async function ProductDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params; // ✅ Suspense এর ভেতরে await করা হচ্ছে
  await connectDB();

  const rawProduct = await Product.findOne({ slug })
    .select("-createdAt -updatedAt")
    .lean<LeanProduct | null>();

  if (!rawProduct) notFound();

  const product: ProductDetailsData = {
    _id: rawProduct._id.toString(),
    name: rawProduct.name ?? "",
    slug: rawProduct.slug ?? "",
    categoryName: rawProduct.categoryName ?? "",
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

  const relatedRaw = await Product.find({
    category: product.category,
    slug: { $ne: slug },
  })
    .limit(4)
    .select("-createdAt -updatedAt")
    .lean<LeanProduct[]>();

  const relatedProducts: RelatedProduct[] = relatedRaw.map((rp) => ({
    _id: rp._id.toString(),
    name: rp.name ?? "",
    slug: rp.slug ?? "",
    categoryName: rp.categoryName ?? "",
    price: rp.price ?? 0,
    oldPrice: rp.oldPrice ?? 0,
    rating: rp.rating ?? 5,
    emoji: rp.emoji ?? "🛒",
    image: rp.image ?? "",
    weight: rp.weight ?? "500 g",
  }));

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
          <span className="text-[#1E7F57]">{product.categoryName}</span>
          <span className="mx-2">/</span>
          <span>Product Details</span>
        </p>
      </section>

      {/* Main Details */}
      <ProductDetailsClient product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#6b6b6b]">
              Related Products
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#1a1a1a]">
              Explore <span className="text-[#1E7F57]">Related Products</span>
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((rp) => (
              <div
                key={rp.slug}
                className="group relative rounded-2xl border border-[#e5e5e5] bg-white p-4 transition hover:border-[#1E7F57] hover:shadow-lg"
              >
                <div className="absolute left-4 top-4 z-10 rounded-md bg-[#1E7F57] px-2 py-1 text-xs font-bold text-white">
                  20% off
                </div>
                <button
                  type="button"
                  className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F4F4] text-[#6b6b6b] transition hover:bg-[#1E7F57] hover:text-white"
                >
                  <Heart size={16} />
                </button>

                <Link href={`/shop/${rp.slug}`}>
                  <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-[#F9F9F9]">
                    {rp.image && rp.image.length > 5 ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={rp.image}
                        alt={rp.name}
                        className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-7xl transition-transform duration-300 group-hover:scale-105">
                        {rp.emoji}
                      </span>
                    )}
                  </div>
                </Link>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6b6b6b]">{rp.categoryName}</span>
                    <span className="flex items-center font-bold text-[#1a1a1a]">
                      <Star
                        size={14}
                        fill="#FBC617"
                        className="mr-1 text-[#FBC617]"
                      />
                      {rp.rating?.toFixed(1) || "5.0"}
                    </span>
                  </div>
                  <Link href={`/shop/${rp.slug}`}>
                    <h3 className="mt-1 font-bold text-[#1a1a1a] transition-colors group-hover:text-[#1E7F57]">
                      {rp.name}
                    </h3>
                  </Link>
                  <p className="mt-1 text-sm text-[#6b6b6b]">{rp.weight}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#1a1a1a]">
                        ৳{rp.price}
                      </span>
                      {(rp.oldPrice ?? 0) > 0 && (
                        <span className="ml-2 text-sm text-[#999] line-through">
                          ৳{rp.oldPrice}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-full bg-[#E8F3EE] px-3 py-1.5 text-sm font-semibold text-[#1E7F57] transition hover:bg-[#1E7F57] hover:text-white"
                    >
                      <ShoppingBag size={14} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
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

function ProductDetailFallback() {
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
    <Suspense fallback={<ProductDetailFallback />}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}