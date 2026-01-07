import mongoose from 'mongoose';
import { CategoryType } from '../types/category.types';

const categorySchema = new mongoose.Schema<CategoryType>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    image_url: { type: String, required: true },
    is_deleted: { type: Boolean, default: false },
  },
  {
    collection: 'categories',
    timestamps: true,
  },
);

const Category: mongoose.Model<CategoryType> =
  mongoose.models.Category ||
  mongoose.model<CategoryType>('Category', categorySchema);

export default Category;
