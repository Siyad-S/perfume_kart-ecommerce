import mongoose from "mongoose";

export interface CategoryType {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image_url: string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}
