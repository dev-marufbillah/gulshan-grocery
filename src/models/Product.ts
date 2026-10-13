import { Schema, models, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    categoryName: { type: String, required: true },
    brand: { type: String, default: "" },
    productType: { type: String, default: "" },
    weight: { type: String, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    image: { type: String, default: "" },
    emoji: { type: String, default: "🛒" },
    stock: { type: Number, default: 100 },
    featured: { type: Boolean, default: true },
    isDeal: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Development e purono cache kora model muchhe notun schema use korbe
if (process.env.NODE_ENV !== "production" && models.Product) {
  delete models.Product;
}

const Product = models.Product || model("Product", ProductSchema);

export default Product;