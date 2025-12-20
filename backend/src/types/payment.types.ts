import { Types } from "mongoose";

export interface RazorpayDetails {
  order_id: string | null;       // Razorpay order ID (e.g. "order_Nkt9Jd6Zxy45")
  payment_id?: string | null;    // Razorpay payment ID (e.g. "pay_NktF7Hh3Plx5")
  signature?: string | null;     // HMAC signature from Razorpay
}

export interface PaymentType {
  _id?: Types.ObjectId;

  user_id?: Types.ObjectId | null; // nullable for guest checkout
  order_id: Types.ObjectId;        // internal reference to 'orders' collection

  razorpay: RazorpayDetails;       // all Razorpay-related data stored here

  amount: number;                  // total amount paid
  currency?: string;               // default "INR"
  payment_status: "pending" | "authorized" | "completed" | "failed" | "refunded";
  payment_method?: string;         // e.g., "card", "upi", "netbanking"
  receipt?: string;                // optional reference ID for tracking

  is_deleted?: boolean;

  created_at?: Date;
  updated_at?: Date;
}
