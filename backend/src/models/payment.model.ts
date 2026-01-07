import mongoose from "mongoose";
import { PaymentType } from "../types/payment.types";

const paymentSchema = new mongoose.Schema<PaymentType>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: true,
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
  },
  {
    collection: "payments",
    timestamps: true,
  }
);



export const Payment: mongoose.Model<PaymentType> =
  mongoose.models.Payment || mongoose.model<PaymentType>("payments", paymentSchema);