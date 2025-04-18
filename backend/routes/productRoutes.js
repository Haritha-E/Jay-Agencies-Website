import express from "express";
import upload from "../middleware/upload.js";
import { addProduct, getAllProducts, deleteProduct, updateProduct, getProductById } from "../controllers/productController.js";
import { addRating, getAllRatings } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router();

// Product routes
router.post("/add", upload.single("productImage"), addProduct);
router.get("/", getAllProducts);
router.delete("/:id", deleteProduct);
router.get("/:id", getProductById);
router.put("/edit/:id", upload.single("productImage"), updateProduct);

// Rating routes
router.post("/rate/:productId", protect, addRating);
router.get("/ratings/:productId", getAllRatings);

export default router;
