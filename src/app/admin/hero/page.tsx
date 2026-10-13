"use client";

import { useEffect, useState } from "react";
import { Save, Image as ImageIcon, CheckCircle2 } from "lucide-react";

type Slide = {
  badge: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  image: string;
};

export default function AdminHeroSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState("");

  const [slides, setSlides] = useState<Slide[]>([
    { badge: "", titlePart1: "", titlePart2: "", description: "", image: "" },
    { badge: "", titlePart1: "", titlePart2: "", description: "", image: "" },
    { badge: "", titlePart1: "", titlePart2: "", description: "", image: "" },
  ]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/hero");
        const data = await res.json();
        if (data.settings && data.settings.slides.length > 0) {
          setSlides(data.settings.slides);
        }
      } catch (err) {
        console.error("Failed to load hero settings", err);
      } finally {
        setFetching(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (index: number, field: keyof Slide, value: string) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides }),
      });
      if (res.ok) {
        setToast("Hero section updated successfully!");
        setTimeout(() => setToast(""), 3000);
      }
    } catch (err) {
      alert("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-[#e5e5e5] px-4 py-3 text-sm outline-none transition focus:border-[#1E7F57]";

  if (fetching) {
    return <div className="p-10 text-center">Loading settings...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#1E7F57] px-6 py-4 text-white shadow-2xl">
          <CheckCircle2 size={24} className="text-[#FBC617]" />
          <p className="text-sm font-bold">{toast}</p>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Hero Settings</h1>
        <p className="text-sm text-[#6b6b6b]">Manage homepage slider images and text.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {slides.map((slide, i) => (
          <div key={i} className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-[#1E7F57]">Slide {i + 1}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">Badge Text</label>
                <input required value={slide.badge} onChange={(e) => handleChange(i, "badge", e.target.value)} placeholder="Ex. The Best Online Grocery" className={inputCls} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">Image URL</label>
                <div className="flex gap-2">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F9F9F9] border border-[#e5e5e5]">
                    <ImageIcon size={20} className="text-[#6b6b6b]" />
                  </div>
                  <input required value={slide.image} onChange={(e) => handleChange(i, "image", e.target.value)} placeholder="https://example.com/image.jpg" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">Title Part 1 (Black)</label>
                <input required value={slide.titlePart1} onChange={(e) => handleChange(i, "titlePart1", e.target.value)} placeholder="Your One-Stop Shop for " className={inputCls} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">Title Part 2 (Green)</label>
                <input required value={slide.titlePart2} onChange={(e) => handleChange(i, "titlePart2", e.target.value)} placeholder="Quality Groceries" className={inputCls} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#1a1a1a]">Description</label>
                <textarea required rows={3} value={slide.description} onChange={(e) => handleChange(i, "description", e.target.value)} placeholder="Short description..." className={inputCls} />
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-full bg-[#1E7F57] px-10 py-3.5 text-sm font-semibold text-white transition hover:bg-[#166b48]">
            <Save size={18} />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}