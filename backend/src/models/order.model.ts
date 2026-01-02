import mongoose from "mongoose";
import { OrderType } from "../types/order.types";

const orderSchema = new mongoose.Schema<OrderType>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    order_date: {
      type: Date,
      default: Date.now,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
    },
    shipping_address: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postal_code: { type: String, required: true },
      phone: { type: String, required: true },
    },
    ordered_items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "products",
        },
        quantity: { type: Number, required: true },
        unit_price: { type: Number, required: true },
      },
    ],
    tracking_number: { type: String, default: null },
    razorpay: {
      order_id: { type: String, default: null },
    },
    paid_at: {
      type: Date,
      default: null,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "orders",
    timestamps: false,
  }
);

orderSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export const Order: mongoose.Model<OrderType> =
  mongoose.models.Order || mongoose.model<OrderType>("orders", orderSchema);