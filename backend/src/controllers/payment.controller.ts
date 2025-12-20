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

/**
 * ✅ Manual Payment Verification
 * Used when verifying Razorpay payment manually from frontend.
 */
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payment_id,
      payment_status,
      error_reason,
    } = req.body;

    // ✅ 1️⃣ If payment failed or cancelled, skip signature validation
    if (payment_status === "failed" || payment_status === "cancelled") {
      const updatedPayment = await PaymentService?.update(payment_id, {
        payment_status,
        updated_at: new Date(),
        // error_reason: error_reason || "Payment failed/cancelled",
      });

      return responseFormatter(
        res,
        updatedPayment,
        `Payment ${payment_status}`,
        200
      );
    }

    // ✅ 2️⃣ Verify signature only for successful payments
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return responseFormatter(res, null, "Payment verification failed", 400);
    }

    // ✅ 4️⃣ Update DB
    const updatedPayment = await PaymentService?.update(payment_id, {
      razorpay: {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        signature: razorpay_signature,
      },
      payment_status: "completed",
      updated_at: new Date(),
    });

    console.log("updatedPayment", updatedPayment);

    // ✅ 3️⃣ Update corresponding order as confirmed
    if (updatedPayment?.payment_status === "completed") {
      const updatedOrder = await orderService?.update(updatedPayment?.order_id as mongoose.Types.ObjectId, {
        status: "confirmed",
        paid_at: new Date(),
        updated_at: new Date(),
      });

      //clear cart
      await UserService?.update(updatedOrder?.user_id as mongoose.Types.ObjectId, {
        cart: [],
      });
    }

    return responseFormatter(res, updatedPayment, "Payment verified successfully", 200);
  } catch (error) {
    console.error("Manual Payment Verification Error:", error);
    return responseFormatter(res, null, "Internal Server Error", 500);
  }
};

/**
 * ✅ Razorpay Webhook Handler
 * Automatically updates local DB based on Razorpay event notifications.
 */
export const razorpayWebhook = async (req: Request, res: Response) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const razorpaySignature = req.headers["x-razorpay-signature"] as string;

    if (!razorpaySignature) {
      return res.status(400).json({ message: "Missing Razorpay signature header" });
    }

    const body = req.body instanceof Buffer ? req.body.toString() : JSON.stringify(req.body);

    const generatedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const { event, payload } = JSON.parse(body);
    const paymentEntity = payload?.payment?.entity || payload?.order?.entity;

    if (!paymentEntity) {
      return res.status(400).json({ message: "Invalid webhook payload" });
    }

    // Find payment in DB
    const paymentDoc = await Payment.findOne({
      "razorpay.order_id": paymentEntity.order_id,
    }).lean();

    if (!paymentDoc?._id) {
      console.warn("Payment not found for webhook:", paymentEntity.order_id);
      return res.status(404).json({ message: "Payment not found" });
    }

    // ✅ Update based on event
    switch (event) {
      case "payment.authorized":
        await PaymentService?.update(paymentDoc._id, {
          payment_status: "authorized",
          razorpay: {
            payment_id: paymentEntity.id,
            order_id: paymentEntity.order_id,
          },
          updated_at: new Date(),
        });
        break;

      case "payment.captured":
        await PaymentService?.update(paymentDoc._id, {
          payment_status: "completed", // internally mark completed
          razorpay: {
            payment_id: paymentEntity.id,
            order_id: paymentEntity.order_id,
          },
          updated_at: new Date(),
        });
        break;

      case "payment.failed":
        await PaymentService?.update(paymentDoc._id, {
          payment_status: "failed",
          updated_at: new Date(),
        });
        break;

      case "refund.processed":
        await PaymentService?.update(paymentDoc._id, {
          payment_status: "refunded",
          updated_at: new Date(),
        });
        break;

      default:
        console.log("Unhandled Razorpay Event:", event);
        break;
    }

    // ✅ Respond quickly so Razorpay doesn’t retry
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Razorpay Webhook Error:", error);
    return res.status(500).json({ message: "Webhook handling failed" });
  }
};


export const retryPayment = async (req: Request, res: Response) => {
  try {
    const { order_id } = req.body;
    if (!order_id) {
      return responseFormatter(res, null, "Missing order ID", 400);
    }

    const paymentDoc = await PaymentService?.findByQuery({
      order_id: new mongoose.Types.ObjectId(order_id),
    });

    if (!paymentDoc?._id) {
      return responseFormatter(res, null, "Payment not found", 404);
    }

    const payment = await PaymentService?.update(paymentDoc._id, {
      payment_status: "completed",
      updated_at: new Date(),
    });

    return responseFormatter(res, payment, "Payment retry initiated", 200);
  } catch (error) {
    console.error("Retry Payment Error:", error);
    return responseFormatter(res, null, "Internal Server Error", 500);
  }
};

export const getPayments = async (
  req: Request<{}, {}, ListRequestType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      search,
      skip = null,
      limit = null,
      sort,
      filter = {},
    } = req.body;
    let listSort: object = { created_at: -1 };
    if (sort) {
      switch (sort) {
        case 'created_at_asc':
          listSort = { created_at: 1 };
          break;
        case 'created_at_desc':
          listSort = { created_at: -1 };
          break;
        case 'amount_asc':
          listSort = { amount: 1 };
          break;
        case 'amount_desc':
          listSort = { amount: -1 };
          break;
        default:
          listSort = { created_at: -1 };
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
  } catch (error) {
    console.log('Payment listing error:', error);
    responseFormatter(res, null, 'Failed to fetch payments', 500);
  }
}

//delete payment
export const deletePayment = async (
  req: Request<{ id: string }, {}, Partial<PaymentItem>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const isExists = await PaymentService?.findByQuery({
      _id: new mongoose.Types.ObjectId(id),
      is_deleted: false
    });

    if (!isExists) {
      return responseFormatter(res, null, 'Payment not found', 404);
    }

    const payment = await PaymentService?.update(new mongoose.Types.ObjectId(id), {
      is_deleted: true,
      updated_at: new Date(),
    });

    return responseFormatter(res, payment, 'Payment deleted', 200);
  } catch (error) {
    console.error('Payment Delete Error:', error);
    responseFormatter(res, null, 'Payment delete failed', 500);
  }
}