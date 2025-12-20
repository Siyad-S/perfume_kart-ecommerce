import mongoose, { Document, Types } from 'mongoose';

// Interface for the Address document
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

// Interface for the User document
export interface UserType extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  // lastName: string;
  email: string;
  phone?: string;
  password: string;
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
  created_at: Date;
  updated_at: Date;
}

// Interface for login/register request body
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
