import { Types } from "mongoose";

export interface RazorpayDetails {
  order_id: string | null;
  payment_id?: string | null;
  signature?: string | null;
}

export interface PaymentType {
  _id?: Types.ObjectId;

  user_id?: Types.ObjectId | null;
  order_id: Types.ObjectId;

  razorpay: RazorpayDetails;

  amount: number;
  currency?: string;
  payment_status: "pending" | "authorized" | "completed" | "failed" | "refunded";
  payment_method?: string;
  receipt?: string;

  is_deleted?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
