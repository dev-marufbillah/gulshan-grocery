import { Schema, models, model } from "mongoose";

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    items: [
      {
        id: { type: String },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        emoji: { type: String, default: "🛒" },
        image: { type: String, default: "" },
        weight: { type: String, default: "" },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ["Processing", "Accepted", "On the Way", "Delivered", "Cancelled"],
      default: "Accepted",
    },
  },
  { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);