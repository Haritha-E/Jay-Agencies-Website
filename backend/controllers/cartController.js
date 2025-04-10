// controllers/cartController.js
import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");

    if (!cart) return res.json({ userId: req.user.id, items: [] });

    // 🔍 Filter out items where the product has been deleted (productId is null)
    const validItems = cart.items.filter(item => item.productId !== null);

    // 🧹 Optional: update the cart in DB to remove invalid items
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.json(cart);
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

  // 🧹 Clear user's cart
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

  
  