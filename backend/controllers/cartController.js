import Cart from "../models/Cart.js";

// ✅ Get cart with filtered items
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("products.productId");

    if (!cart) return res.status(200).json({ products: [] });

    // Filter out deleted products
    const validProducts = cart.products.filter(item => item.productId !== null);

    if (validProducts.length !== cart.products.length) {
      cart.products = validProducts;
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart." });
  }
};

// ✅ Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        products: [{ productId, quantity }],
      });
    } else {
      if (!Array.isArray(cart.products)) {
        cart.products = [];
      }

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
    // Send the updated cart data as the response
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Cart add error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Remove specific product from cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: "Product removed", cart });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item from cart." });
  }
};

// ✅ Update quantity of a product in cart
export const updateCartQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.products.find(item => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Quantity updated", cart });
  } catch (err) {
    res.status(500).json({ message: "Failed to update quantity" });
  }
};

// ✅ Clear entire cart
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

// ✅ Get cart items only (used for Products page maybe)
export const getCartItems = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("products.productId", "name price image");

    if (!cart) {
      return res.json({ products: [] });
    }

    res.json({ products: cart.products });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Server error" });
  }
};
