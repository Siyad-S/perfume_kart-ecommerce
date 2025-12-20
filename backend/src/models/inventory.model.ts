import mongoose from 'mongoose';
import { InventoryType } from '../types/inventory.types';

const inventorySchema = new mongoose.Schema<InventoryType>(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'products',
    },
    stock_quantity: { type: Number, required: true },
    restock_date: { type: Date, required: true },
    low_stock_threshold: { type: Number, required: true },
    is_deleted: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    collection: 'inventory',
    timestamps: true,
  },
);

export const Inventory: mongoose.Model<InventoryType> =
  mongoose.models.Inventory ||
  mongoose.model<InventoryType>('inventory', inventorySchema);
