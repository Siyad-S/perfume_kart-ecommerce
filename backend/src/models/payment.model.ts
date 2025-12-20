import mongoose from "mongoose";
import { PaymentType } from "../types/payment.types";

const paymentSchema = new mongoose.Schema<PaymentType>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false, // Allow guest checkouts
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: true, // Require order_id to link payment to order
    },
    razorpay: {
      order_id: { type: String, required: true, unique: true }, // Razorpay order ID
      payment_id: { type: String, default: null, sparse: true }, // Set after payment
      signature: { type: String, default: null, sparse: true }, // Set after verification
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    payment_status: {
      type: String,
      enum: ["pending", "authorized", "completed", "failed", "refunded"],
      default: "pending",
    },
    payment_method: {
      type: String,
      default: null,
    },
    receipt: {
      type: String,
      required: true,
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
    collection: "payments",
    timestamps: false,
  }
);

paymentSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export const Payment: mongoose.Model<PaymentType> =
  mongoose.models.Payment || mongoose.model<PaymentType>("payments", paymentSchema);