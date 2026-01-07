import mongoose from "mongoose";

export interface ImageSearchCacheType {
  image_hash: string;
  product_id: mongoose.Types.ObjectId;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}