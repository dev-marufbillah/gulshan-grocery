import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String },
    userPhone: { type: String },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
        unit: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Processing", "Delivered", "Cancel Requested", "Cancelled"],
      default: "Pending",
    },
    cancelReason: { type: String, default: "" },
    cancelRequestedAt: { type: Date },
  },
  { timestamps: true }
);

const Order = models.Order || model("Order", OrderSchema);
export default Order;