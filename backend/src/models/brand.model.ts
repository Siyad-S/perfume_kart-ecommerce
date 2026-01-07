import mongoose from 'mongoose';
import { BrandType } from '../types/brand.types';

const brandSchema = new mongoose.Schema<BrandType>(
  {
    name: { type: String, required: true },
    logo_url: { type: String, required: true },
    description: { type: String },
    origin: { type: String },
    is_deleted: { type: Boolean, default: false },
  },
  {
    collection: 'brands',
    timestamps: true,
  },
);

const Brand: mongoose.Model<BrandType> =
  mongoose.models.Brand || mongoose.model<BrandType>('brand', brandSchema);

export default Brand;
