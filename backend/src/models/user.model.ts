import mongoose from 'mongoose';
import { UserType } from '../types/user.types';

const userSchema: mongoose.Schema<UserType> = new mongoose.Schema<UserType>(
  {
    name: { type: String, required: true },
    // lastName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    password: { type: String, required: true },
    addresses: [
      {
        fullName: { type: String, required: false },
        street: { type: String, required: false },
        city: { type: String, required: false },
        state: { type: String, required: false },
        country: { type: String, required: false },
        postal_code: { type: String, required: false },
        phone: { type: String, required: false },
      },
    ],
    // role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'role', required: false },
    role: { type: String, required: false },
    cart: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
        quantity: { type: Number, required: true },
      },
    ],
    viewedProducts: [
      { product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'product' } },
    ],
    languagePreferences: {
      type: String,
      enum: ['en', 'ar'],
      default: 'en',
      required: true,
    },
    favourites: [
      {
        product_id: mongoose.Schema.Types.ObjectId,
      },
    ],
    wishlist: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
        quantity: { type: Number, required: true },
      },
    ],
    is_deleted: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    collection: 'users',
    timestamps: false,
  },
);

const User: mongoose.Model<UserType> =
  mongoose.models.User || mongoose.model<UserType>('user', userSchema);
export default User;