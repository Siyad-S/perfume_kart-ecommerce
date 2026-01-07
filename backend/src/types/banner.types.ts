import mongoose from "mongoose";

export interface BannerType {
  _id?: mongoose.Types.ObjectId;
  banner_url: string;
  product_id?: mongoose.Types.ObjectId | string;
  category_id?: mongoose.Types.ObjectId | string;
  banner_text?: string;
  description?: string;
  home_slider: boolean,
  home_sub: boolean,
  category_listing: boolean,
  is_deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}