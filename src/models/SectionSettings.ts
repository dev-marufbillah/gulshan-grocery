import mongoose, { Schema, models } from "mongoose";

const SectionSettingsSchema = new Schema(
  {
    faq: {
      show: { type: Boolean, default: true },
      subtitle: { type: String, default: "News & Blogs" },
      title: { type: String, default: "Our Latest News & Blogs" },
      items: [
        {
          q: { type: String, default: "" },
          a: { type: String, default: "" },
        },
      ],
    },
    gallery: {
      show: { type: Boolean, default: true },
      photos: [{ image: { type: String, default: "" } }],
    },
    // 🌟 New Promo Banners Schema
    promoBanners: {
      show: { type: Boolean, default: true },
      banner1: {
        badge: { type: String, default: "Flat 20% Discount" },
        title: { type: String, default: "Purely Fresh Vegetables" },
        description: { type: String, default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
        link: { type: String, default: "/shop?category=vegetables" },
        image: { type: String, default: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80" },
      },
      banner2: {
        badge: { type: String, default: "Flat 25% Discount" },
        title: { type: String, default: "Fresh Fruits, Pure Quality" },
        description: { type: String, default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
        link: { type: String, default: "/shop?category=fresh-fruits" },
        image: { type: String, default: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80" },
      },
    },
  },
  { timestamps: true }
);

export default models.SectionSettings || mongoose.model("SectionSettings", SectionSettingsSchema);