import mongoose from "mongoose";

export interface ListRequestType {
  search: string;
  skip: number;
  limit: number;
  sort: string;
  filter: {
    category_id?: mongoose.Types.ObjectId;
    brand_id?: mongoose.Types.ObjectId;
    brand?: mongoose.Types.ObjectId[];
    price?: {
      min: number;
      max: number;
    };
    payment_status?: string;
    payment_method?: string;
    order_status?: string;
    search?: string;
  };
}

export interface CustomRequest {
  body?: object;
  query?: object;
  params?: object;
  headers?: object;
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
  token?: string;
}

export interface CustomResponse {
  data?: object;
  message?: string;
  status?: number;
}
