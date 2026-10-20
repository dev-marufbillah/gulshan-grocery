import mongoose, { Schema, models, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  category: string;
  author: string;
  image: string;
  intro: string;
  sections: { title: string; body: string }[];
  tips: string[];
  features: { title: string; text: string }[];
  createdAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, default: "Grocery" },
    author: { type: String, default: "Gulshan Team" },
    image: { type: String, required: true },
    intro: { type: String, required: true },
    sections: [
      {
        title: { type: String },
        body: { type: String },
      },
    ],
    tips: [{ type: String }],
    features: [
      {
        title: { type: String },
        text: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Blog = models.Blog || mongoose.model<IBlog>("Blog", blogSchema);