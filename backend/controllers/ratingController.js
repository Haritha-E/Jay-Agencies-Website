import Rating from "../models/Rating.js";
import Product from "../models/Product.js";

// @desc    Add or update a rating
// @route   POST /api/ratings/:productId
// @access  Private
export const addOrUpdateRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, feedback } = req.body;
    const userId = req.user._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if rating already exists by this user for this product
    let existingRating = await Rating.findOne({ productId, userId });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.feedback = feedback;
      await existingRating.save();
      return res.status(200).json({ message: "Rating updated", rating: existingRating });
    } else {
      // Add new rating
      const newRating = new Rating({ productId, userId, rating, feedback });
      await newRating.save();
      return res.status(201).json({ message: "Rating added", rating: newRating });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all ratings for a product
// @route   GET /api/ratings/:productId
// @access  Public
export const getProductRatings = async (req, res) => {
  try {
    const { productId } = req.params;

    const ratings = await Rating.find({ productId })
      .populate("userId", "name profilePic") // Populating userId with name and profilePic
      .exec(); // Always use exec() for better error handling with Mongoose

    // If no ratings found
    if (ratings.length === 0) {
      return res.status(404).json({ message: "No ratings found for this product" });
    }

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get current user's rating for a product
// @route   GET /api/ratings/:productId/my
// @access  Private
export const getMyRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const rating = await Rating.findOne({ productId, userId });

    if (!rating) {
      return res.status(404).json({ message: "No rating found for this product" });
    }

    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
