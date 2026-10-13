import mongoose, { Schema, models } from "mongoose";

const HeroSettingSchema = new Schema(
  {
    slides: [
      {
        badge: { type: String, default: "" },
        titlePart1: { type: String, default: "" },
        titlePart2: { type: String, default: "" },
        description: { type: String, default: "" },
        image: { type: String, default: "" }, // URL of the image
      },
    ],
  },
  { timestamps: true }
);

export default models.HeroSetting || mongoose.model("HeroSetting", HeroSettingSchema);