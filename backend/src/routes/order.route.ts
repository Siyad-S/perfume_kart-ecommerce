// routes/paymentRoutes.ts
import { createOrder, deleteOrder, getOrders, updateOrder } from "@/controllers/order.controller";
import express from "express";
const router = express.Router();

router.post("/create", createOrder);
router.post("/list", getOrders);
router.patch("/update/:id", updateOrder);
router.put("/delete/:id", deleteOrder);

export default router;
