"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Edit, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

export type AdminProduct = {
  _id: string;
  name: string;
  categoryName: string;
  price: number;
  oldPrice: number;
  weight: string;
  stock: number;
  image: string;
  emoji: string;
};

export default function ProductsTableClient({
  initialProducts,
}: {
  initialProducts: AdminProduct[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        showToast("Product deleted successfully!", "success");
        setProducts((prev) => prev.filter((p) => p._id !== id));
        router.refresh();
      } else {
        showToast(data.error || "Failed to delete product", "error");
      }
    } catch {
      showToast("Network error while deleting product", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white shadow-sm">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-6 py-4 text-white shadow-2xl transition-all ${
            toast.type === "success" ? "bg-[#1E7F57]" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={22} className="text-[#FBC617]" />
          ) : (
            <AlertCircle size={22} />
          )}
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="border-b border-[#e5e5e5] p-4">
        <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-[#e5e5e5] bg-[#F9F9F9] px-4 py-2 transition focus-within:border-[#1E7F57] focus-within:bg-white">
          <Search size={18} className="text-[#6b6b6b]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or category..."
            className="w-full bg-transparent text-sm text-[#1a1a1a] outline-none"
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#1a1a1a]">
          <thead className="bg-[#F9F9F9] text-xs font-bold uppercase tracking-wider text-[#6b6b6b]">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5]">
            {filteredProducts.map((p) => (
              <tr key={p._id} className="transition hover:bg-[#F9F9F9]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e5e5e5] bg-[#F9F9F9]">
                      {p.image && p.image.length > 5 ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform hover:scale-110"
                        />
                      ) : (
                        <span className="text-2xl">{p.emoji}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[#1a1a1a]">{p.name}</p>
                      <p className="text-xs text-[#6b6b6b]">{p.weight}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-[#6b6b6b]">
                  {p.categoryName}
                </td>
                <td className="px-6 py-4 font-bold text-[#1a1a1a]">
                  ৳{p.price}
                  {p.oldPrice > 0 && (
                    <span className="ml-2 text-xs font-normal text-[#9a9a9a] line-through">
                      ৳{p.oldPrice}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      p.stock > 0
                        ? "bg-[#E8F3EE] text-[#1E7F57]"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-3">
                    {/* ✅ EDIT BUTTON: LINKS TO EDIT PAGE */}
                    <Link
                      href={`/admin/products/edit/${p._id}`}
                      className="text-[#1E7F57] hover:text-[#166b48] transition"
                      title="Edit Product"
                    >
                      <Edit size={18} />
                    </Link>

                    {/* ✅ DELETE BUTTON: TRIGGERS REAL API DELETE */}
                    <button
                      type="button"
                      disabled={deletingId === p._id}
                      onClick={() => handleDelete(p._id, p.name)}
                      className="text-red-500 hover:text-red-700 transition disabled:opacity-30"
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#6b6b6b]">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}