import mongoose, { Document, Types } from 'mongoose';

export interface AddressType {
  _id?: mongoose.Types.ObjectId;
  fullName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
}

export interface UserType extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  // lastName: string;
  email: string;
  phone?: string;
  password?: string;
  googleId?: string;
  newPassword?: string;
  confirmPassword?: string;
  addresses?: AddressType[];
  address?: AddressType;
  // role_id: Types.ObjectId;
  role: string;
  cart: Array<{
    product_id: Types.ObjectId;
    quantity: number;
  }>;
  viewedProducts: Array<{
    product_id: Types.ObjectId;
  }>;
  languagePreferences: 'en' | 'ar';
  favourites: Array<{
    product_id: Types.ObjectId;
  }>;
  wishlist: Array<{
    product_id: Types.ObjectId;
    quantity: number;
  }>;
  is_deleted: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface LoginRegisterType {
  name: string;
  // lastName: string;
  role?: string;
  email: string;
  password: string;
}

export interface LoginType {
  email: string;
  password: string;
}
