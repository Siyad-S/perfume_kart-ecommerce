import mongoose from "mongoose";

export interface BrandType {
  _id?: mongoose.Types.ObjectId;
  name: string;
  logo_url?: string;
  description?: string;
  origin?: string;
  is_deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}