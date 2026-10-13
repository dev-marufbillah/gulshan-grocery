"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  X,
  CheckCircle2,
} from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(""); // 🌟 Custom Toast State

  // Form States
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [stock, setStock] = useState("100");
  const [description, setDescription] = useState("");

  // Image States
  const [imageType, setImageType] = useState<"file" | "url">("file");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const inputCls =
    "w-full rounded-xl border border-[#e5e5e5] px-4 py-3 text-sm outline-none transition focus:border-[#1E7F57] bg-white text-[#1a1a1a]";

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

  // Handle File Upload (Convert File to Base64)
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
        setImageUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url);
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          category,
          price,
          oldPrice,
          weight,
          stock,
          image: imageUrl, // Real Image Data
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add product");
        setLoading(false);
        return;
      }

      // 🌟 Trigger Custom Toast Notification
      setToast("Product added successfully!");
      setLoading(false);

      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1500);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-4xl space-y-6">
      {/* 🌟 CUSTOM FLOATING TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#1E7F57] px-6 py-4 text-white shadow-2xl animate-in slide-in-from-top-5 duration-300">
          <CheckCircle2 size={24} className="text-[#FBC617]" />
          <div>
            <p className="font-bold text-sm">{toast}</p>
            <p className="text-xs text-white/80">Redirecting to products list...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e5e5] bg-white text-[#1a1a1a] transition hover:bg-[#F9F9F9]"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Add New Product</h1>
          <p className="text-sm text-[#6b6b6b]">Fill in the details and upload product image.</p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm sm:p-8"
      >
        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        {/* IMAGE UPLOAD SECTION */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
            Product Image *
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
            <div className="relative flex h-48 w-48 items-center justify-center rounded-2xl border border-[#e5e5e5] bg-[#F9F9F9] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full rounded-xl object-contain"
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
                <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e5e5e5] bg-[#F9F9F9] transition hover:border-[#1E7F57] hover:bg-white">
                  <ImageIcon size={32} className="text-[#6b6b6b]" />
                  <p className="mt-2 text-sm text-[#6b6b6b]">
                    Click to upload product image
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
                  value={imageUrl}
                  onChange={handleUrlChange}
                  placeholder="Paste image URL (e.g. https://images.unsplash.com/photo-1610832958506)"
                  className={inputCls}
                />
              )}
            </div>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
              Product Name *
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Ex. Fresh Mango"
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
              Product Slug *
            </label>
            <input
              required
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="fresh-mango"
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
              Category *
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputCls}
            >
              <option value="">Select Category...</option>
              <option value="fresh-fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="drinks">Beverages</option>
              <option value="snacks">Snacks &amp; Sweets</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
              Weight / Unit *
            </label>
            <input
              required
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ex. 1 Kg or 500 g"
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
              Price (৳) *
            </label>
            <input
              required
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="160"
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
              Old Price (৳) (Optional)
            </label>
            <input
              type="number"
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
              placeholder="200"
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
              Stock Quantity *
            </label>
            <input
              required
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="100"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a short description about the product..."
            className={`${inputCls} resize-none`}
          />
        </div>

        <div className="flex justify-end border-t border-[#e5e5e5] pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-[#1E7F57] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#166b48] disabled:opacity-70"
          >
            <Save size={18} />
            {loading ? "Saving to DB..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}