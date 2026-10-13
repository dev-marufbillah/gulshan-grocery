import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // পাসওয়ার্ড এনক্রিপ্ট করে রাখবো
    role: { 
      type: String, 
      enum: ["superadmin", "admin", "user"], 
      default: "user" 
    },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);