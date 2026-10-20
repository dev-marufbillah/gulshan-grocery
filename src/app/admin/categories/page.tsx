"use client";

/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */
import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Star,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  X,
  AlertTriangle,
} from "lucide-react";

type CategoryData = {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  productCount?: number;
  order?: number;
  featured?: boolean;
  createdAt?: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Delete Confirmation Modal Popup State
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [featured, setFeatured] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Image Upload / Link States
  const [imageType, setImageType] = useState<"file" | "url">("file");
  const [iconUrl, setIconUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
      }
    } catch {
      showToast("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (isMounted) {
          if (res.ok) {
            setCategories(data.categories || []);
          } else {
            setToast({
              message: data.error || "Failed to load categories",
              type: "error",
            });
          }
        }
      } catch {
        if (isMounted) {
          setToast({
            message: "Network error while fetching categories",
            type: "error",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto Generate Slug from Name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  // Local File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setIconUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setIconUrl(url);
    setImagePreview(url);
  };

  const handleRemoveImage = () => {
    setIconUrl("");
    setImagePreview("");
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          icon: iconUrl,
          featured,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        showToast("Category created successfully!", "success");
        setName("");
        setSlug("");
        handleRemoveImage();
        setFeatured(true);
        setShowForm(false);
        fetchCategories();
      } else {
        showToast(data.error || "Failed to create category", "error");
      }
    } catch {
      showToast("Network error while creating category", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Trigger Delete Confirmation Popup
  const promptDelete = (id: string, catName: string) => {
    setDeleteTarget({ id, name: catName });
  };

  // Perform Actual Delete on Confirm
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        showToast("Category deleted successfully!", "success");
        fetchCategories();
      } else {
        showToast(data.error || "Failed to delete category", "error");
      }
    } catch {
      showToast("Network error while deleting category", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls =
    "w-full rounded-full border border-[#e5e5e5] px-5 py-3.5 text-sm outline-none transition focus:border-[#1E7F57] bg-white text-[#1a1a1a]";

  return (
    <div className="space-y-6 relative">
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

      {/* CUSTOM DELETE CONFIRMATION MODAL POPUP */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#e5e5e5] space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a]">Delete Category</h3>
                <p className="text-xs text-[#6b6b6b]">Confirm permanent deletion</p>
              </div>
            </div>

            <p className="text-sm text-[#1a1a1a]">
              Are you sure you want to delete{" "}
              <span className="font-bold text-[#1E7F57]">&quot;{deleteTarget.name}&quot;</span>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e5e5e5]">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-full border border-[#e5e5e5] px-5 py-2.5 text-sm font-semibold text-[#6b6b6b] hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {deleting ? (
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

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Categories</h1>
          <p className="text-sm text-[#6b6b6b]">
            Manage product categories for your store.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-full bg-[#1E7F57] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#166b48]"
        >
          <Plus size={18} />
          {showForm ? "Close Form" : "Add Category"}
        </button>
      </div>

      {/* Add Category Form */}
      {showForm && (
        <form
          onSubmit={handleCreateCategory}
          className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="mb-6 text-lg font-bold text-[#1a1a1a]">
            Create New Category
          </h2>

          {/* CATEGORY IMAGE SELECTION */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
              Category Image *
            </label>

            <div className="mb-4 flex gap-3 border-b border-[#e5e5e5] pb-3">
              <button
                type="button"
                onClick={() => {
                  setImageType("file");
                  handleRemoveImage();
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  imageType === "file"
                    ? "bg-[#1E7F57] text-white"
                    : "bg-[#F4F4F4] text-[#6b6b6b]"
                }`}
              >
                <Upload size={14} /> Upload File
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageType("url");
                  handleRemoveImage();
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  imageType === "url"
                    ? "bg-[#1E7F57] text-white"
                    : "bg-[#F4F4F4] text-[#6b6b6b]"
                }`}
              >
                <LinkIcon size={14} /> Image URL / Link
              </button>
            </div>

            {imagePreview ? (
              <div className="relative flex h-36 w-36 items-center justify-center rounded-2xl border border-[#e5e5e5] bg-[#F9F9F9] p-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div>
                {imageType === "file" ? (
                  <label className="flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e5e5e5] bg-[#F9F9F9] transition hover:border-[#1E7F57] hover:bg-white">
                    <ImageIcon size={30} className="text-[#6b6b6b]" />
                    <p className="mt-2 text-sm text-[#6b6b6b]">
                      Click to upload category image
                    </p>
                    <span className="mt-1 text-xs font-semibold text-[#1E7F57]">
                      PNG, JPG, WEBP up to 5MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <input
                    type="url"
                    value={iconUrl}
                    onChange={handleUrlChange}
                    placeholder="Paste category image URL (e.g. https://images.unsplash.com/photo-1542838132)"
                    className={inputCls}
                  />
                )}
              </div>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                Category Name *
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Ex. Dairy Products"
                className={inputCls}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                URL Slug *
              </label>
              <input
                required
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="dairy-products"
                className={inputCls}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-[#e5e5e5] pt-5">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded accent-[#1E7F57]"
              />
              <span className="text-sm font-medium text-[#1a1a1a]">
                Feature this category on Homepage
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[#1E7F57] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#166b48] disabled:opacity-70"
            >
              {submitting ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      )}

      {/* Categories Table */}
      <div className="rounded-2xl border border-[#e5e5e5] bg-white shadow-sm">
        <div className="border-b border-[#e5e5e5] p-4">
          <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-[#e5e5e5] bg-[#F9F9F9] px-4 py-2 transition focus-within:border-[#1E7F57] focus-within:bg-white">
            <Search size={18} className="text-[#6b6b6b]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full bg-transparent text-sm text-[#1a1a1a] outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#1a1a1a]">
            <thead className="bg-[#F9F9F9] text-xs font-bold uppercase tracking-wider text-[#6b6b6b]">
              <tr>
                <th className="px-6 py-4">Image &amp; Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Products</th>
                <th className="px-6 py-4">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#6b6b6b]">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1E7F57] border-t-transparent" />
                      <span>Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#6b6b6b]">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((c) => (
                  <tr key={c._id} className="transition hover:bg-[#F9F9F9]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e5e5e5] bg-[#F9F9F9] text-2xl">
                          {c.icon && c.icon.length > 5 ? (
                            <img
                              src={c.icon}
                              alt={c.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span>{c.icon || "🛒"}</span>
                          )}
                        </div>
                        <p className="font-bold text-[#1a1a1a]">{c.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#6b6b6b]">
                      {c.slug}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#1a1a1a]">
                      {c.productCount ?? 0} items
                    </td>
                    <td className="px-6 py-4">
                      {c.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F3EE] px-3 py-1 text-xs font-bold text-[#1E7F57]">
                          <Star size={12} fill="#1E7F57" /> Featured
                        </span>
                      ) : (
                        <span className="text-xs text-[#9a9a9a]">Standard</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => promptDelete(c._id, c.name)}
                        className="text-red-500 transition hover:text-red-700 p-2 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}