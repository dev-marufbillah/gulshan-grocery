import { Schema, models, model } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    author: { type: String, default: "Jenny Alexander" },
    publishedAt: { type: Date, default: Date.now },
    excerpt: { type: String, default: "" },
    image: { type: String, default: "" }, // jemon "/images/blog-1.jpg"
    emoji: { type: String, default: "📰" }, // image na thakle eta dekhabe
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Blog = models.Blog || model("Blog", BlogSchema);

export default Blog;