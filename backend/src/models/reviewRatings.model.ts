import mongoose from 'mongoose';
import { ReviewRatingType } from '../types/reviewRatings.types';

export const ReviewRatingSchema = new mongoose.Schema<ReviewRatingType>(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'products',
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    rating: { type: Number, required: true },
    review_text: { type: String, required: true },
    sentiment_score: { type: Number, default: 0 },
    is_verified: { type: Boolean, default: false },
  },
  {
    collection: 'review_ratings',
    timestamps: true,
  },
);

export const ReviewRating: mongoose.Model<ReviewRatingType> =
  mongoose.models.ReviewRatings ||
  mongoose.model<ReviewRatingType>('review_rating', ReviewRatingSchema);
