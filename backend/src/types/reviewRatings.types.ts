import mongoose from "mongoose";

export interface ReviewRatingType {
  product_id: mongoose.Schema.Types.ObjectId;
  user_id: mongoose.Schema.Types.ObjectId;
  rating: number;
  review_text: string;
  sentiment_score: number;
  is_verified: boolean;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}