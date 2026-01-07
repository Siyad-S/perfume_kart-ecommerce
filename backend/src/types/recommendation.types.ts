import mongoose from "mongoose";

export interface RecommendationType extends Document {
  product_id: [mongoose.Types.ObjectId];
  user_id: mongoose.Types.ObjectId;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}