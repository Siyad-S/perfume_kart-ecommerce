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
  },
  {
    collection: 'recommendations',
    timestamps: true,
  },
);

export const Recommendation: mongoose.Model<RecommendationType> =
  mongoose.models.Recommendation ||
  mongoose.model<RecommendationType>('recommendation', recommendationSchema);
