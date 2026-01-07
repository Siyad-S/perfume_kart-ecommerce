import mongoose from 'mongoose';
import { ImageSearchCacheType } from '../types/imageSearchCache.types';

const imageSearchCacheSchema = new mongoose.Schema<ImageSearchCacheType>(
  {
    image_hash: { type: String, required: true },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'products',
    },
    is_deleted: { type: Boolean, default: false },
  },
  {
    collection: 'image_search_caches',
    timestamps: true,
  },
);

export const ImageSearchCache: mongoose.Model<ImageSearchCacheType> =
  mongoose.models.ImageSearchCache ||
  mongoose.model<ImageSearchCacheType>(
    'image_search_cache',
    imageSearchCacheSchema,
  );
