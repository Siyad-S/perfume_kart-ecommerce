import mongoose from 'mongoose';
import { CategoryType } from '../types/category.types';

const categorySchema = new mongoose.Schema<CategoryType>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    image_url: { type: String, required: true },
    is_deleted: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    collection: 'categories',
    timestamps: false,
  },
);

const Category: mongoose.Model<CategoryType> =
  mongoose.models.Category ||
  mongoose.model<CategoryType>('Category', categorySchema);

export default Category;
