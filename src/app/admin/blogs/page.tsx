/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  AlertCircle, 
  FileText, 
  Image as ImageIcon, 
  User, 
  Tag, 
  X,
  ExternalLink,
  RefreshCw
} from "lucide-react";

interface BlogItem {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  image: string;
  intro: string;
  createdAt?: string;
}

const CATEGORIES = [
  "Organic Living",
  "Buying Guide",
  "Company News",
  "Health & Wellness",
  "Tips & Tricks",
  "Recipes"
];

const DEFAULT_BLOG_IMAGE = "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=1000";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Organic Living",
    author: "Gulshan Team",
    image: "",
    intro: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || []);
      } else {
        setStatus({ type: "error", message: "Failed to load blogs" });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Error fetching blogs" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const resetForm = () => {
    setFormData({
      title: "",
      category: "Organic Living",
      author: "Gulshan Team",
      image: "",
      intro: ""
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (blog: BlogItem) => {
    setIsEditing(true);
    setEditId(blog._id || blog.id || null);
    setFormData({
      title: blog.title || "",
      category: blog.category || "Organic Living",
      author: blog.author || "Gulshan Team",
      image: blog.image || "",
      intro: blog.intro || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const url = isEditing && editId ? `/api/admin/blogs/${editId}` : "/api/admin/blogs";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: "success",
          message: isEditing ? "Blog post updated successfully!" : "New blog post created!"
        });
        resetForm();
        fetchBlogs();
      } else {
        setStatus({ type: "error", message: data.message || "Failed to save blog post" });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Something went wrong while saving" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStatus({ type: "success", message: "Blog post deleted successfully" });
        fetchBlogs();
      } else {
        setStatus({ type: "error", message: "Failed to delete blog post" });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Error deleting blog post" });
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-emerald-100 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-[#1E7F57]" />
            Blog Post Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, edit, and manage articles for Gulshan Grocery blog
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchBlogs()}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-[#1E7F57] hover:border-emerald-200 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin text-[#1E7F57]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Status Notification */}
      {status.message && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 text-sm font-semibold transition-all ${
            status.type === "success"
              ? "bg-emerald-50 text-[#1E7F57] border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {status.type === "success" ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{status.message}</span>
          </div>
          <button onClick={() => setStatus({ type: "", message: "" })} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add / Edit Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100/60 overflow-hidden">
        <div className="bg-linear-to-r from-emerald-900 to-[#1E7F57] px-6 py-4 text-white flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            {isEditing ? <Edit3 className="w-5 h-5 text-[#FBC617]" /> : <Plus className="w-5 h-5 text-[#FBC617]" />}
            {isEditing ? "Edit Blog Article" : "Create New Blog Article"}
          </h2>
          {isEditing && (
            <button
              onClick={resetForm}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-white transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Article Title</label>
              <input
                type="text"
                required
                placeholder="e.g. 10 Benefits of Eating Fresh Organic Vegetables Daily"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#1E7F57] focus:ring-2 focus:ring-[#1E7F57]/20 outline-none text-sm font-medium text-gray-800"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#1E7F57]" /> Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#1E7F57] focus:ring-2 focus:ring-[#1E7F57]/20 outline-none text-sm font-medium text-gray-800 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#1E7F57]" /> Author Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Gulshan Team or Nutrition Specialist"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#1E7F57] focus:ring-2 focus:ring-[#1E7F57]/20 outline-none text-sm font-medium text-gray-800"
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#1E7F57]" /> Cover Image URL
              </label>
              <input
                type="text"
                required
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#1E7F57] focus:ring-2 focus:ring-[#1E7F57]/20 outline-none text-sm font-medium text-gray-800"
              />
              {Boolean(formData.image) && (
                <div className="mt-2 relative h-32 w-full max-w-sm rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={formData.image || DEFAULT_BLOG_IMAGE}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Intro / Excerpt */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Short Description / Excerpt
              </label>
              <textarea
                required
                rows={3}
                placeholder="Brief summary of the article that appears on the main blog list..."
                value={formData.intro}
                onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#1E7F57] focus:ring-2 focus:ring-[#1E7F57]/20 outline-none text-sm font-medium text-gray-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-600 hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#1E7F57] hover:bg-emerald-800 font-semibold text-white shadow-md shadow-emerald-900/10 transition-all text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Saving...</span>
              ) : isEditing ? (
                <>
                  <Check className="w-4 h-4" /> Save Article Changes
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Publish Blog Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Blog List Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100/60 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Existing Blog Articles
            <span className="text-xs font-semibold bg-emerald-100 text-[#1E7F57] px-2.5 py-1 rounded-full">
              {blogs.length} Total
            </span>
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-[#1E7F57] focus:ring-2 focus:ring-[#1E7F57]/20 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500 font-medium animate-pulse">
            Loading blog posts...
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-12 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
            No blog posts found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => {
              const bId = blog._id || blog.id || "";
              const blogImg = blog.image && blog.image.trim() !== "" ? blog.image : DEFAULT_BLOG_IMAGE;

              return (
                <div
                  key={bId || blog.slug}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                      <img
                        src={blogImg}
                        alt={blog.title || "Blog cover"}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 text-xs font-bold bg-[#1E7F57] text-white px-2.5 py-1 rounded-full shadow">
                        {blog.category}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-gray-900 line-clamp-2 text-base leading-snug">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                        {blog.intro}
                      </p>
                      <div className="pt-2 text-xs text-gray-400 font-medium">
                        By {blog.author}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-2">
                    <a
                      href={`/blogs/${blog.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View
                    </a>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-emerald-50 hover:text-[#1E7F57] hover:border-emerald-200 transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bId, blog.title)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-100 bg-white text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}