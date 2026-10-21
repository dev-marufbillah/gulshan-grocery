import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String, default: "" },
    gender: { type: String, default: "Female" },
    image: { type: String, default: "" },
    role: { 
      type: String, 
      enum: ["superadmin", "admin", "user"], 
      default: "user" 
    },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);