// controllers/cartController.js
import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    res.json(cart || { userId: req.user.id, items: [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart." });
  }
};

const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      setToast("Please login to add to cart ❗");
      setTimeout(() => setToast(null), 2000);
      return;
    }
  
    try {
      await addToCart(productId);
      setToast("Product added to cart ✅");
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      console.error("Error adding to cart", err);
      setToast("Something went wrong ❗");
      setTimeout(() => setToast(null), 2000);
    }
  };
  

export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove item from cart." });
  }
};

export const updateCartQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
      const cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) return res.status(404).json({ error: "Cart not found" });
  
      const item = cart.items.find(item => item.productId.toString() === productId);
      if (!item) return res.status(404).json({ error: "Item not found in cart" });
  
      item.quantity = quantity;
      await cart.save();
  
      res.status(200).json({ message: "Quantity updated", cart });
    } catch (err) {
      res.status(500).json({ error: "Failed to update quantity" });
    }
  };
  