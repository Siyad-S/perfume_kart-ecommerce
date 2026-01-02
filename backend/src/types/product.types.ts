import mongoose from 'mongoose';

export interface ProductType extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  brand_id: mongoose.Types.ObjectId;
  price: number;
  discount_price: number;
  stock_quantity: number;
  sku: string;
  notes?: {
    top: string[];
    middle: string[];
    base: string[];
  };
  image_urls?: string[];
  tags?: string[];
  banner_url: string;
  category_id: mongoose.Types.ObjectId;
  best_seller: boolean;
  trending: boolean;
  new_launch: boolean;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}
