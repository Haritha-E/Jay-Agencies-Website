import express from "express";
import { addOrUpdateRating, getProductRatings, getMyRating } from "../controllers/ratingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/ratings/:productId
// @desc    Add or update rating for a product
// @access  Private (Protected route)
router.post("/:productId", protect, addOrUpdateRating);

// @route   GET /api/ratings/:productId
// @desc    Get all ratings for a product
// @access  Public (No authentication required)
router.get("/:productId", getProductRatings);

// @route   GET /api/ratings/:productId/my
// @desc    Get the current user's rating for a product
// @access  Private (Protected route)
router.get("/:productId/my", protect, getMyRating);

export default router;
