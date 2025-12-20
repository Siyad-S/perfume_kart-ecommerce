import mongoose from 'mongoose';
import { RecommendationType } from '../types/recommendation.types';

const recommendationSchema = new mongoose.Schema<RecommendationType>(
  {
    product_id: [
      { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Products' },
    ],
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    is_deleted: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    collection: 'recommendations',
    timestamps: true,
  },
);

export const Recommendation: mongoose.Model<RecommendationType> =
  mongoose.models.Recommendation ||
  mongoose.model<RecommendationType>('recommendation', recommendationSchema);
