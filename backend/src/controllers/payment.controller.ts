import Razorpay from "razorpay";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { responseFormatter } from "@/utils/responseFormatter";
import PaymentService from "../services/payment.service";
import { Payment } from "../models/payment.model";
import mongoose from "mongoose";
import orderService from "../services/order.service";
import UserService from "../services/user.service";
import { ListRequestType } from "@/types/common.types";
import { catchAsync } from "@/utils/catchAsync";
import { AppError } from "@/utils/AppError";

// Manual Payment Verification
export const verifyPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    payment_id,
    payment_status,
    error_reason,
  } = req.body;

  if (payment_status === "failed" || payment_status === "cancelled") {
    const updatedPayment = await PaymentService?.update(payment_id, {
      payment_status,
    });

    return responseFormatter(
      res,
      updatedPayment,
      `Payment ${payment_status}`,
      200
    );
  }

  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return next(new AppError("Payment verification failed", 400));
  }

  const updatedPayment = await PaymentService?.update(payment_id, {
    razorpay: {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature,
    },
    payment_status: "completed",
  });

  if (updatedPayment?.payment_status === "completed") {
    const updatedOrder = await orderService?.update(updatedPayment?.order_id as mongoose.Types.ObjectId, {
      status: "confirmed",
      paid_at: new Date(),
    });

    //clear cart
    await UserService?.update(updatedOrder?.user_id as mongoose.Types.ObjectId, {
      cart: [],
    });
  }

  return responseFormatter(res, updatedPayment, "Payment verified successfully", 200);
});

// Razorpay Webhook Handler
export const razorpayWebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const razorpaySignature = req.headers["x-razorpay-signature"] as string;

  if (!razorpaySignature) {
    return next(new AppError("Missing Razorpay signature header", 400));
  }

  const body = req.body instanceof Buffer ? req.body.toString() : JSON.stringify(req.body);

  const generatedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    return next(new AppError("Invalid webhook signature", 400));
  }

  const { event, payload } = JSON.parse(body);
  const paymentEntity = payload?.payment?.entity || payload?.order?.entity;

  if (!paymentEntity) {
    return next(new AppError("Invalid webhook payload", 400));
  }

  // Find payment in DB
  const paymentDoc = await Payment.findOne({
    "razorpay.order_id": paymentEntity.order_id,
  }).lean();

  if (!paymentDoc?._id) {
    console.warn("Payment not found for webhook:", paymentEntity.order_id);
    return next(new AppError("Payment not found", 404));
  }

  // Update based on event
  switch (event) {
    case "payment.authorized":
      await PaymentService?.update(paymentDoc._id, {
        payment_status: "authorized",
        razorpay: {
          payment_id: paymentEntity.id,
          order_id: paymentEntity.order_id,
        },
      });
      break;

    case "payment.captured":
      await PaymentService?.update(paymentDoc._id, {
        payment_status: "completed",
        razorpay: {
          payment_id: paymentEntity.id,
          order_id: paymentEntity.order_id,
        },
      });
      break;

    case "payment.failed":
      await PaymentService?.update(paymentDoc._id, {
        payment_status: "failed",
      });
      break;

    case "refund.processed":
      await PaymentService?.update(paymentDoc._id, {
        payment_status: "refunded",
      });
      break;

    default:
      console.log("Unhandled Razorpay Event:", event);
      break;
  }

  res.status(200).json({ status: "ok" });
});

// retry payment
export const retryPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { order_id } = req.body;
  if (!order_id) {
    return next(new AppError("Missing order ID", 400));
  }

  const paymentDoc = await PaymentService?.findByQuery({
    order_id: new mongoose.Types.ObjectId(order_id),
  });

  if (!paymentDoc?._id) {
    return next(new AppError("Payment not found", 404));
  }

  const payment = await PaymentService?.update(paymentDoc._id, {
    payment_status: "completed",
  });

  return responseFormatter(res, payment, "Payment retry initiated", 200);
});

// get payments
export const getPayments = catchAsync(async (
  req: Request<{}, {}, ListRequestType>,
  res: Response,
  next: NextFunction,
) => {
  const {
    search,
    skip = null,
    limit = null,
    sort,
    filter = {},
  } = req.body;
  let listSort: object = { createdAt: -1 };
  if (sort) {
    switch (sort) {
      case 'createdAt_asc':
        listSort = { createdAt: 1 };
        break;
      case 'createdAt_desc':
        listSort = { createdAt: -1 };
        break;
      case 'amount_asc':
        listSort = { amount: 1 };
        break;
      case 'amount_desc':
        listSort = { amount: -1 };
        break;
      default:
        listSort = { createdAt: -1 };
        break;
    }
  }

  (filter as { sort: object }).sort = listSort

  if (search) {
    (filter as { search: string }).search = search;
  }

  if (filter?.payment_status) {
    (filter as { payment_status: string }).payment_status = filter.payment_status;
  }

  if (filter?.payment_method) {
    (filter as { payment_method: string }).payment_method = filter.payment_method;
  }

  const includes = ['order', 'user'];
  // const projectArray = []

  const payments = await PaymentService?.list(skip, limit, filter, includes);

  responseFormatter(res, payments, 'Payments fetched success!', 200);
});

//delete payment
export const deletePayment = catchAsync(async (
  req: Request<{ id: string }, {}, Partial<{ id: string }>>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const isExists = await PaymentService?.findByQuery({
    _id: new mongoose.Types.ObjectId(id),
    is_deleted: false
  });

  if (!isExists) {
    return next(new AppError('Payment not found', 404));
  }

  const payment = await PaymentService?.update(new mongoose.Types.ObjectId(id), {
    is_deleted: true,
  });

  return responseFormatter(res, payment, 'Payment deleted', 200);
});