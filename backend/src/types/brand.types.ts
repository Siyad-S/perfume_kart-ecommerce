import mongoose from "mongoose";

export interface BrandType {
  _id?: mongoose.Types.ObjectId;
  name: string;
  logo_url?: string;
  description?: string;
  origin?: string;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}