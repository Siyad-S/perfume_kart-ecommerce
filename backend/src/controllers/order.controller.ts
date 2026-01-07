// controllers/paymentController.ts
import Razorpay from "razorpay";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import OrderServices from "../services/order.service";
import PaymentServices from "../services/payment.service";
import { OrderType } from '../types/order.types';
import { responseFormatter } from "@/utils/responseFormatter";
import { catchAsync } from "@/utils/catchAsync";
import { AppError } from "@/utils/AppError";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

//create order
export const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {
    user_id,
    total_amount,
    status = "pending",
    shipping_address,
    ordered_items,
    currency = "INR",
  } = req.body;

  const razorpayOrder = await razorpay.orders.create({
    amount: total_amount * 100,
    currency,
    receipt: `order_${Date.now()}`,
    notes: {
      user_id,
      total_amount,
      status,
      shipping_address,
      ordered_items,
    },
  })

  const order = await OrderServices?.create({
    user_id,
    total_amount,
    status,
    shipping_address,
    ordered_items,
    razorpay: {
      order_id: razorpayOrder.id,
    },
  })

  // Create payment
  await PaymentServices?.create({
    user_id,
    order_id: order._id,
    razorpay: { order_id: razorpayOrder.id },
    amount: total_amount,
    currency,
    receipt: razorpayOrder.receipt,
    payment_status: "pending",
  });

  return responseFormatter(res, { order, payment: null }, "Order created successfully", 200)
});

// get orders
export const getOrders = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const includes = ['user', 'product'];

  const { search, skip, limit, sort, filter: bodyFilter } = req.body;

  const orders = await OrderServices?.list(skip, limit, bodyFilter || {}, includes); // improved call

  const filter = bodyFilter || {};
  let listSort: any = { createdAt: -1 };

  if (sort) {
    const sortMap: any = {
      'order_date_asc': { order_date: 1 },
      'order_date_desc': { order_date: -1 },
      'createdAt_asc': { createdAt: 1 },
      'createdAt_desc': { createdAt: -1 },
      'total_amount_asc': { total_price: 1 },
      'total_amount_desc': { total_price: -1 },
      'paid_at_asc': { paid_at: 1 },
      'paid_at_desc': { paid_at: -1 }
    };
    if (sortMap[sort]) listSort = sortMap[sort];
  }

  filter.sort = listSort;
  if (search) filter.search = search;
  if (filter.order_status) filter.status = filter.order_status;

  const result = await OrderServices?.list(skip || 0, limit || 10, filter, includes);
  return responseFormatter(res, result, 'Order list', 200);
});

// update order
export const updateOrder = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { status } = req.body as Partial<OrderType>;
  const isExists = await OrderServices?.findByQuery({
    _id: new mongoose.Types.ObjectId(id),
    is_deleted: false
  });

  if (!isExists) {
    return next(new AppError('Order not found', 404));
  }

  const order = await OrderServices?.update(new mongoose.Types.ObjectId(id), {
    status
  });
  return responseFormatter(res, order, 'Order updated', 200);
});

// delete order
export const deleteOrder = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const isExists = await OrderServices?.findByQuery({
    _id: new mongoose.Types.ObjectId(id),
    is_deleted: false
  });

  if (!isExists) {
    return next(new AppError('Order not found', 404));
  }

  const order = await OrderServices?.update(new mongoose.Types.ObjectId(id), {
    is_deleted: true,
  });

  return responseFormatter(res, order, 'Order deleted', 200);
});

