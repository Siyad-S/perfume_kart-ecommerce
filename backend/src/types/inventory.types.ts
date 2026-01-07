import mongoose from "mongoose";

export interface InventoryType {
  product_id: mongoose.Types.ObjectId;
  stock_quantity: number;
  restock_date: Date;
  low_stock_threshold: number;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}