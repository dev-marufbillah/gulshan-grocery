"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ProductData {
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  unit: string;
  image: string;
  isFlashDeal: boolean;
  stock: number;
  description: string;
}

interface ToastMessage {
  type: "success" | "error";
  text: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<ToastMessage | null>(null);

  const [product, setProduct] = useState<ProductData>({
    name: "",
    category: "Vegetables",
    price: 0,
    oldPrice: 0,
    unit: "1kg",
    image: "",
    isFlashDeal: false,
    stock: 100,
    description: "",
  });

  const showNotification = (type: "success" | "error", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${resolvedParams.id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.statusText}`);
        }
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        showNotification("error", "Failed to load product data.");
        setTimeout(() => {
          router.push("/admin/products");
        }, 1500);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/products/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      showNotification("success", "Product updated successfully!");
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
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Toast Notification Banner */}
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

      {/* Header Bar */}
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
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 space-y-6">
        {/* Title and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Product Name</label>
            <input
              type="text"
              required
              className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <select
              className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white transition-all"
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
            >
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Dairy</option>
              <option>Meat & Fish</option>
              <option>Groceries</option>
              <option>Snacks</option>
            </select>
          </div>
        </div>

        {/* Pricing & Unit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Selling Price (৳)</label>
            <input
              type="number"
              required
              min="0"
              className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Old Price (৳) - Optional</label>
            <input
              type="number"
              min="0"
              className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-500 transition-all"
              value={product.oldPrice || ""}
              onChange={(e) => setProduct({ ...product, oldPrice: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Unit (e.g. 1kg, 500g)</label>
            <input
              type="text"
              required
              className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              value={product.unit}
              onChange={(e) => setProduct({ ...product, unit: e.target.value })}
            />
          </div>
        </div>

        {/* Image File Upload & URL */}
        <div className="space-y-4 pt-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-green-600" /> Product Image
          </label>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-44 h-44 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-gray-50 overflow-hidden relative shrink-0">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                  <p className="text-xs text-gray-400 font-medium">No Image Selected</p>
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
                  <Upload className="w-5 h-5" /> Choose Image File from Device
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
                  value={product.image.startsWith("data:") ? "" : product.image}
                  onChange={(e) => setProduct({ ...product, image: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Special Offer Toggle */}
        <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
          <input
            type="checkbox"
            id="flashDeal"
            className="w-5 h-5 accent-orange-600 cursor-pointer rounded"
            checked={product.isFlashDeal}
            onChange={(e) => setProduct({ ...product, isFlashDeal: e.target.checked })}
          />
          <label htmlFor="flashDeal" className="font-semibold text-orange-900 cursor-pointer text-sm">
            Mark as Flash Deal / Special Offer 🔥
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
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