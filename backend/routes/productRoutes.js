import express from "express";
import upload from "../middleware/upload.js";
import { addProduct, getAllProducts, deleteProduct, updateProduct, getProductById } from "../controllers/productController.js";
import { addRating, getAllRatings } from "../controllers/productController.js"; // import rating controllers
import { protect } from "../middleware/authMiddleware.js"; // import protect middleware

const router = express.Router();

// Product routes
router.post("/add", upload.single("productImage"), addProduct);
router.get("/", getAllProducts);
router.delete("/:id", deleteProduct);
router.get("/:id", getProductById);
router.put("/edit/:id", upload.single("productImage"), updateProduct);

// Rating routes
router.post("/rate/:productId", protect, addRating); // Add rating with authentication
router.get("/ratings/:productId", getAllRatings); // Get all ratings for a product (no authentication)

export default router;
