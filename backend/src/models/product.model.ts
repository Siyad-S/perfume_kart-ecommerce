import mongoose from 'mongoose';
import { ProductType } from '../types/product.types';

const productSchema = new mongoose.Schema<ProductType>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'brands',
    },
    price: { type: Number, required: true },
    discount_price: { type: Number, required: true },
    stock_quantity: { type: Number, required: true },
    sku: { type: String, required: false }, //Stock keeping unit for inventory tracking
    notes: {
      top: { type: [String], required: true },
      middle: { type: [String], required: false },
      base: { type: [String], required: false },
    }, //Notes of perfume
    image_urls: { type: [String], required: true },
    tags: { type: [String], required: true },
    banner_url: { type: String, required: false },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'categories',
    },
    // numReviews: { type: Number, required: true },
    best_seller: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    new_launch: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    collection: 'products',
    timestamps: false,
  },
);

const Product: mongoose.Model<ProductType> =
  mongoose.models.Product ||
  mongoose.model<ProductType>('product', productSchema);

export default Product;
