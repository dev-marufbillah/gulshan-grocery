"use client";

/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { 
  Edit, 
  Trash2, 
  Search, 
  Sparkles, 
  Tag, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

export type AdminProduct = {
  _id: string;
  name: string;
  categoryName: string;
  price: number;
  oldPrice?: number;
  isOffer?: boolean;
  weight?: string;
  stock?: number;
  image?: string;
  emoji?: string;
};

export default function ProductsTableClient({
  initialProducts,
}: {
  initialProducts: AdminProduct[];
}) {
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "offers">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 🌟 Toast Notification State
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // 🌟 Delete Confirmation Modal Popup State
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Trigger Delete Modal
  const promptDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  // Perform Actual Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget.id);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { 
        method: "DELETE" 
      });
      const data = await res.json();

      if (res.ok || data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== deleteTarget.id));
        showToast(`"${deleteTarget.name}" deleted successfully!`, "success");
      } else {
        showToast(data.message || data.error || "Failed to delete product", "error");
      }
    } catch (err) {
      console.error("Delete error", err);
      showToast("Failed to delete product", "error");
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(search.toLowerCase());

    if (filter === "offers") {
      return matchesSearch && (p.isOffer || (p.oldPrice && p.oldPrice > p.price));
    }

    return matchesSearch;
  });

  const offerCount = products.filter(
    (p) => p.isOffer || (p.oldPrice && p.oldPrice > p.price)
  ).length;

  return (
    <div className="space-y-4 relative">
      {/* 🌟 Toast Notification */}
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

      {/* 🌟 CUSTOM DELETE CONFIRMATION MODAL POPUP */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#e5e5e5] space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a]">Delete Product</h3>
                <p className="text-xs text-[#6b6b6b]">Confirm permanent deletion</p>
              </div>
            </div>

            <p className="text-sm text-[#1a1a1a]">
              Are you sure you want to delete &quot;<span className="font-bold text-[#1E7F57]">{deleteTarget.name}</span>&quot;? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e5e5e5]">
              <button
                type="button"
                disabled={!!deletingId}
                onClick={() => setDeleteTarget(null)}
                className="rounded-full border border-[#e5e5e5] px-5 py-2.5 text-sm font-semibold text-[#6b6b6b] hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!!deletingId}
                onClick={handleConfirmDelete}
                className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {deletingId ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 size={16} /> Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#e5e5e5] bg-white p-4 shadow-xs">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search products or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2 text-xs focus:border-[#1E7F57] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              filter === "all"
                ? "bg-[#1E7F57] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("offers")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              filter === "offers"
                ? "bg-red-600 text-white"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            <Sparkles size={14} /> Flash Deals ({offerCount})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white shadow-xs">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#e5e5e5] bg-gray-50 text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Discount</th>
                  <th className="px-4 py-3 font-semibold text-center">Offer Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5]">
                {filteredProducts.map((p) => {
                  const isOfferActive = p.isOffer || (p.oldPrice && p.oldPrice > p.price);
                  const discount =
                    p.oldPrice && p.oldPrice > p.price
                      ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                      : null;

                  return (
                    <tr key={p._id} className="hover:bg-gray-50/80 transition">
                      {/* Product Name & Image */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 border border-gray-100">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt={p.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-base">{p.emoji || "🛒"}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{p.name}</p>
                            {p.weight && (
                              <p className="text-[10px] text-gray-400">{p.weight}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 font-medium text-gray-600">
                        {p.categoryName || "Uncategorized"}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-extrabold text-[#1E7F57]">৳{p.price}</span>
                          {p.oldPrice && p.oldPrice > p.price ? (
                            <span className="text-[10px] text-gray-400 line-through">
                              ৳{p.oldPrice}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Discount Badge */}
                      <td className="px-4 py-3">
                        {discount ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                            <Tag size={11} /> {discount}% OFF
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400">Regular</span>
                        )}
                      </td>

                      {/* Offer Status */}
                      <td className="px-4 py-3 text-center">
                        {isOfferActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                            <Sparkles size={11} /> HOT OFFER
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-500">
                            Normal
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${p._id}/edit`}
                            className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-[#1E7F57] hover:bg-[#1E7F57] hover:text-white transition"
                          >
                            <Edit size={13} /> Edit / Offer
                          </Link>
                          <button
                            type="button"
                            onClick={() => promptDelete(p._id, p.name)}
                            disabled={deletingId === p._id}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}