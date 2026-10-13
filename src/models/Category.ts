import { Schema, models, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: "🛒" }, // emoji ba image path (/images/cat-x.png)
    productCount: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Category || model("Category", CategorySchema);