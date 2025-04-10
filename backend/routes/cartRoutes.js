import express from "express";
import Cart from "../models/Cart.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

// Add product to cart
router.post("/add", protect, async (req, res) => {
    try {
      const { productId, quantity = 1 } = req.body;
  
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
  
      // Find the user's cart
      let cart = await Cart.findOne({ user: req.user._id });
  
      // If no cart, create one
      if (!cart) {
        cart = new Cart({
          user: req.user._id,
          products: [{ productId, quantity }],
        });
      } else {
        // Ensure products array exists
        if (!Array.isArray(cart.products)) {
          cart.products = [];
        }
  
        // Check if product already in cart
        const existingItem = cart.products.find(
          (item) => item.productId.toString() === productId
        );
  
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.products.push({ productId, quantity });
        }
      }
  
      await cart.save();
      res.status(200).json({ message: "Product added to cart" });
    } catch (error) {
      console.error("Cart add error:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  // Get user's cart
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("products.productId");
    if (!cart) {
      return res.status(200).json({ products: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// Remove item from cart
router.delete("/remove/:productId", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== req.params.productId
    );

    await cart.save();
    res.status(200).json({ message: "Product removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing product" });
  }
});

// Update quantity of a cart item
router.put("/update", protect, async (req, res) => {
    const { productId, quantity } = req.body;
  
    try {
      const cart = await Cart.findOne({ user: req.user._id });
  
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      const product = cart.products.find(
        (item) => item.productId.toString() === productId
      );
  
      if (product) {
        product.quantity = quantity;
        await cart.save();
        return res.status(200).json({ message: "Quantity updated", cart });
      } else {
        return res.status(404).json({ message: "Product not found in cart" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error updating quantity" });
    }
  });
  
export default router;
