// routes/paymentRoutes.ts
import { createOrder } from "@/controllers/order.controller";
import { deletePayment, getPayments, retryPayment, verifyPayment } from "@/controllers/payment.controller";
import express from "express";
const router = express.Router();

router.post("/verify", verifyPayment);
router.post("/retry", retryPayment);
router.post("/list", getPayments);
router.put("/delete/:id", deletePayment);

export default router;
