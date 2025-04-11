import express from "express";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  markOrderAsDelivered,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);
router.put("/deliver/:id", protect, admin, markOrderAsDelivered);

export default router;
