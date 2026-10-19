import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { Plus } from "lucide-react";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductsTableClient, {
  AdminProduct,
} from "@/components/ProductsTableClient";

export const metadata = { title: "Manage Products & Offers | Admin" };

async function ProductsDataLoader() {
  await connection();
  await connectDB();

  const rawProducts = await Product.find({})
    .sort({ _id: -1 })
    .select("name categoryName category price oldPrice isOffer weight stock image emoji")
    .lean();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products: AdminProduct[] = rawProducts.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name ?? "",
    categoryName: p.categoryName || p.category || "Uncategorized",
    price: p.price ?? 0,
    oldPrice: p.oldPrice ?? 0,
    isOffer: Boolean(p.isOffer || (p.oldPrice && p.oldPrice > p.price)),
    weight: p.weight ?? "",
    stock: p.stock ?? 0,
    image: p.image ?? "",
    emoji: p.emoji ?? "🛒",
  }));

  return <ProductsTableClient initialProducts={products} />;
}

function TableSkeleton() {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-8 text-center shadow-xs">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#1E7F57] border-t-transparent" />
      <p className="mt-4 text-sm text-[#6b6b6b]">Loading products &amp; offers...</p>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Products &amp; Special Offers</h1>
          <p className="text-sm text-[#6b6b6b]">
            Manage products, discount pricing, and flash deals.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-[#1E7F57] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#166b48]"
        >
          <Plus size={18} />
          Add New Product
        </Link>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <ProductsDataLoader />
      </Suspense>
    </div>
  );
}