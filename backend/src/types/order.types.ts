import mongoose from "mongoose";

export interface OrderType extends Document {
  _id?: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  order_date: Date;
  total_amount: number;
  status: string;
  shipping_address: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    phone: string;
  };
  contact: string;
  ordered_items: [
    {
      product_id: mongoose.Types.ObjectId;
      quantity: number;
      unit_price: number;
    },
  ];
  tracking_number?: string;
  razorpay: {
    order_id: string | null;
    payment_id?: string | null;
    signature?: string | null;
  };
  paid_at?: Date | null;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}