// routes/paymentRoutes.ts
import { createOrder } from '../controllers/order.controller';
import { deletePayment, getPayments, retryPayment, verifyPayment } from '../controllers/payment.controller';
import express from "express";
import { validate } from '../middlewares/validate.middleware';
import { verifyPaymentSchema, retryPaymentSchema, paymentListSchema, paymentIdSchema } from '../validations/payment.validation';

const router = express.Router();

router.post("/verify", validate(verifyPaymentSchema), verifyPayment);
router.post("/retry", validate(retryPaymentSchema), retryPayment);
router.post("/list", validate(paymentListSchema), getPayments);
router.put("/delete/:id", validate(paymentIdSchema), deletePayment);

export default router;
