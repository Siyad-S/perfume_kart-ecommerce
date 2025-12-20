// controllers/paymentController.ts
import Razorpay from "razorpay";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import OrderServices from "../services/order.service";
import PaymentServices from "../services/payment.service";
import { OrderType } from '../types/order.types';
import { responseFormatter } from "@/utils/responseFormatter";
import { ListRequestType } from "@/types/common.types";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      user_id,
      total_amount,
      status = "pending",
      shipping_address,
      ordered_items,
      // tracking_number,
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

    // Create payment entry in payments collection
    const payment = await PaymentServices?.create({
      user_id,
      order_id: order._id,
      razorpay: { order_id: razorpayOrder.id },
      amount: total_amount,
      currency,
      receipt: razorpayOrder.receipt,
      payment_status: "pending",
    });

    return responseFormatter(res, { order, payment }, "Order created successfully", 200)
  } catch (error) {
    return responseFormatter(res, null, "Order creation failed", 500)
  }
};

export const getOrders = async (
  req: Request<{}, {}, Partial<ListRequestType>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, skip = null, limit = null, sort, filter = {} } = req.body;

    let listSort: object = { created_at: -1 };
    if (sort) {
      switch (sort) {
        case 'order_date_asc':
          listSort = { order_date: 1 };
          break;
        case 'order_date_desc':
          listSort = { order_date: -1 };
          break;
        case 'created_at_asc':
          listSort = { created_at: 1 };
          break;
        case 'created_at_desc':
          listSort = { created_at: -1 };
          break;
        case 'total_amount_asc':
          listSort = { total_price: 1 };
          break;
        case 'total_amount_desc':
          listSort = { total_price: -1 };
          break;
        case 'paid_at_asc':
          listSort = { paid_at: 1 };
          break;
        case 'paid_at_desc':
          listSort = { paid_at: -1 };
          break;
        default:
          listSort = { created_at: -1 };
          break;
      }
    }
    (filter as { sort: object }).sort = listSort;

    if (search) {
      (filter as { search: string }).search = search;
    }

    if (filter?.order_status) {
      (filter as { status: string }).status = filter.order_status;
    }

    const includes = ['user', 'product'];
    // const projectArray = []

    const orders = await OrderServices?.list(
      skip,
      limit,
      filter,
      includes,
    );

    return responseFormatter(res, orders, 'Order list', 200);

  } catch (error) {
    console.error('Order List Error:', error);
    responseFormatter(res, null, 'Order list failed', 500);
  }
}

// update category
export const updateOrder = async (
  req: Request<{ id: string }, {}, Partial<OrderType>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body as Partial<OrderType>;
    const isExists = await OrderServices?.findByQuery({
      _id: new mongoose.Types.ObjectId(id),
      is_deleted: false
    });

    if (!isExists) {
      return responseFormatter(res, null, 'Order not found', 404);
    }

    const bodyData: Partial<OrderType> = {};

    if (status) {
      bodyData.status = "cancelled"
    }

    const order = await OrderServices?.update(new mongoose.Types.ObjectId(id), {
      status
    });
    return responseFormatter(res, order, 'Order updated', 200);
  } catch (error) {
    console.error('Order Update Error:', error);
    responseFormatter(res, null, 'Order update failed', 500);
  }
}

// delete category
export const deleteOrder = async (
  req: Request<{ id: string }, {}, Partial<OrderType>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const isExists = await OrderServices?.findByQuery({
      _id: new mongoose.Types.ObjectId(id),
      is_deleted: false
    });

    if (!isExists) {
      return responseFormatter(res, null, 'Order not found', 404);
    }

    const order = await OrderServices?.update(new mongoose.Types.ObjectId(id), {
      is_deleted: true,
      updated_at: new Date(),
    });

    return responseFormatter(res, order, 'Order deleted', 200);
  } catch (error) {
    console.error('Order Delete Error:', error);
    responseFormatter(res, null, 'Order delete failed', 500);
  }
}

