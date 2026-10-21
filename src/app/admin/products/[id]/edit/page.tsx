"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Flame,
} from "lucide-react";

interface ProductData {
  name: string;
  category: string;
  categoryName: string;
  price: number;
  oldPrice?: number;
  weight: string;
  image: string;
  isDeal: boolean;
  stock: number;
  description: string;
}

interface ToastMessage {
  type: "success" | "error";
  text: string;
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<ToastMessage | null>(null);

  const [product, setProduct] = useState<ProductData>({
    name: "",
    category: "vegetables",
    categoryName: "Vegetables",
    price: 0,
    oldPrice: 0,
    weight: "1kg",
    image: "",
    isDeal: false,
    stock: 100,
    description: "",
  });

  const showNotification = (type: "success" | "error", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${resolvedParams.id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.statusText}`);
        }
        const raw = await res.json();
        const data = raw?.data || raw;

        setProduct({
          name: data.name || "",
          category: data.category || "vegetables",
          categoryName: data.categoryName || data.category || "Vegetables",
          price: Number(data.price) || 0,
          oldPrice: Number(data.oldPrice) || 0,
          weight: data.weight || data.unit || "",
          image: data.image || "",
          isDeal: Boolean(data.isDeal ?? data.isFlashDeal ?? false),
          stock: Number(data.stock) || 0,
          description: data.description || "",
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        showNotification("error", "Failed to load product data.");
        setTimeout(() => router.push("/admin/products"), 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id, router]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        showNotification("error", "File is too large. Max 1.5MB allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prev) => ({ ...prev, image: reader.result as string }));
        showNotification("success", "Image file uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (val: string) => {
    setProduct((prev) => ({
      ...prev,
      category: val.toLowerCase(),
      categoryName: val,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...product,
        isDeal: Boolean(product.isDeal),
        isFlashDeal: Boolean(product.isDeal),
      };

      const res = await fetch(`/api/admin/products/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      showNotification(
        "success",
        product.isDeal
          ? "Saved! Product added to Offers page 🔥"
          : "Saved! Product removed from Offers."
      );
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Error updating product:", error);
      showNotification("error", "Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
        <p className="text-gray-500 font-medium">Loading Product details...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24">
      {/* Notification Toast */}
      {toastMsg && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white font-medium transition-all ${
            toastMsg.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toastMsg.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-xs text-gray-500">ID: {resolvedParams.id}</p>
          </div>
        </div>

        {/* Live Status Badge */}
        {product.isDeal ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 border border-orange-300 px-3 py-1.5 text-xs font-bold text-orange-700 shadow-sm">
            <Flame size={14} className="fill-orange-500 text-orange-500" />
            In Offers Page 🔥
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-500">
            Normal Product
          </span>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8"
      >
        {/* Name & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              required
              className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              value={product.name || ""}
              onChange={(e) =>
                setProduct({ ...product, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Category
            </label>
            <select
              className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white transition-all cursor-pointer"
              value={product.categoryName || "Vegetables"}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Dairy">Dairy</option>
              <option value="Meat & Fish">Meat & Fish</option>
              <option value="Groceries">Groceries</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>
        </div>

        {/* 🚀 SMART PRICING & DISCOUNT SECTION */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
            Pricing & Smart Discount Calculator
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-inner">
            {/* 1. Old Price */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Old Price (আগের দাম) ৳
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 180"
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-gray-500 transition-all"
                value={product.oldPrice || ""}
                onChange={(e) => {
                  const oldP = Number(e.target.value) || 0;
                  setProduct((prev) => ({ ...prev, oldPrice: oldP }));
                }}
              />
            </div>

            {/* 2. Selling Price */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                Selling Price (বিক্রয় মূল্য) ৳
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 150"
                className="w-full p-3 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none font-bold text-emerald-700 text-lg transition-all shadow-sm"
                value={product.price || ""}
                onChange={(e) => {
                  const newPrice = Number(e.target.value) || 0;
                  setProduct((prev) => ({ ...prev, price: newPrice }));
                }}
              />
            </div>

            {/* 3. Auto Discount Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex justify-between">
                <span>Discount %</span>
                <span className="text-emerald-600">(ছাড়)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="99"
                  placeholder="e.g. 10"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-orange-600 pr-8 transition-all"
                  value={
                    product.oldPrice && product.oldPrice > product.price
                      ? Math.round(
                          ((product.oldPrice - product.price) /
                            product.oldPrice) *
                            100
                        )
                      : ""
                  }
                  onChange={(e) => {
                    const percent = Number(e.target.value) || 0;
                    if (product.oldPrice && product.oldPrice > 0) {
                      const calculatedPrice = Math.round(
                        product.oldPrice - (product.oldPrice * percent) / 100
                      );
                      setProduct((prev) => ({ ...prev, price: calculatedPrice }));
                    }
                  }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-orange-400">
                  %
                </span>
              </div>
            </div>

            {/* 4. Live Summary */}
            <div className="flex flex-col justify-center items-center bg-white p-3 rounded-xl border border-dashed border-emerald-300 text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Customer Save
              </span>
              {product.oldPrice && product.oldPrice > product.price ? (
                <div className="mt-1 flex flex-col items-center">
                  <span className="text-[11px] font-black bg-orange-500 text-white px-2 py-0.5 rounded-full inline-block animate-pulse">
                    {Math.round(
                      ((product.oldPrice - product.price) / product.oldPrice) *
                        100
                    )}
                    % OFF
                  </span>
                  <p className="text-[11px] font-bold text-emerald-700 mt-1.5">
                    ৳{product.oldPrice - product.price} বাঁচবে
                  </p>
                </div>
              ) : (
                <span className="text-xs font-semibold text-gray-400 mt-2">
                  No Discount
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stock & Unit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Weight / Unit (e.g. 1kg, 500g, 12 pcs)
            </label>
            <input
              type="text"
              className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              value={product.weight || ""}
              onChange={(e) =>
                setProduct({ ...product, weight: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              value={product.stock || 0}
              onChange={(e) =>
                setProduct({ ...product, stock: Number(e.target.value) })
              }
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4 pt-2 border-t border-gray-100 pt-6">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-green-600" /> Product Image
          </label>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-44 h-44 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-gray-50 overflow-hidden relative shrink-0">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                  <p className="text-xs text-gray-400 font-medium">
                    No Image
                  </p>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="flex items-center justify-center gap-2 w-full p-3.5 bg-green-50 text-green-700 font-semibold rounded-xl cursor-pointer hover:bg-green-100 transition-colors border border-green-200"
                >
                  <Upload className="w-5 h-5" /> Choose from Device
                </label>
              </div>

              <div className="relative">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider absolute -top-2.5 left-3 bg-white px-1">
                  OR Image URL
                </span>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm transition-all"
                  value={
                    product.image?.startsWith("data:")
                      ? ""
                      : product.image || ""
                  }
                  onChange={(e) =>
                    setProduct({ ...product, image: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 border-t border-gray-100 pt-6">
          <label className="text-sm font-semibold text-gray-700">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
            value={product.description || ""}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            placeholder="Write a short description..."
          />
        </div>

        {/* ✅ OFFER TOGGLE */}
        <div
          className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
            product.isDeal
              ? "bg-orange-50 border-orange-400 shadow-sm shadow-orange-100"
              : "bg-gray-50 border-gray-200 hover:border-gray-300"
          }`}
          onClick={() =>
            setProduct((prev) => ({
              ...prev,
              isDeal: !prev.isDeal,
            }))
          }
        >
          <input
            type="checkbox"
            id="flashDeal"
            className="mt-1 w-5 h-5 accent-orange-600 cursor-pointer rounded shrink-0"
            checked={Boolean(product.isDeal)}
            onChange={(e) =>
              setProduct({ ...product, isDeal: e.target.checked })
            }
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex-1">
            <label
              htmlFor="flashDeal"
              className="font-bold text-orange-900 cursor-pointer text-sm flex items-center gap-2"
            >
              <Flame
                size={16}
                className={
                  product.isDeal
                    ? "fill-orange-500 text-orange-500"
                    : "text-gray-400"
                }
              />
              Mark as Flash Deal / Special Offer 🔥
            </label>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">
              {product.isDeal ? (
                <span className="text-orange-700 font-medium">
                  ✓ ON — এই প্রোডাক্টটি Offers পেজে দেখাবে।
                </span>
              ) : (
                <span className="text-gray-500">
                  OFF — এটি সাধারণ প্রোডাক্ট। Offers পেজে দেখাবে না।
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Changes
          </button>
          <Link
            href="/admin/products"
            className="px-8 py-4 bg-gray-100 text-gray-700 text-center rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}