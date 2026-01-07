// routes/paymentRoutes.ts
import { createOrder, deleteOrder, getOrders, updateOrder } from "@/controllers/order.controller";
import express from "express";
import { validate } from "@/middlewares/validate.middleware";
import { createOrderSchema, orderListSchema, updateOrderSchema, orderIdSchema } from "@/validations/order.validation";

const router = express.Router();

router.post("/create", validate(createOrderSchema), createOrder);
router.post("/list", validate(orderListSchema), getOrders);
router.patch("/update/:id", validate(updateOrderSchema), updateOrder);
router.put("/delete/:id", validate(orderIdSchema), deleteOrder);

export default router;
