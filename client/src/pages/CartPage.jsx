import React, { useEffect, useState } from "react";
import { getCartItems, removeFromCart, updateCartQuantity } from "../api";
import "./CartPage.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const res = await getCartItems();
      console.log("Cart Response 👉", res.data);
      setCartItems(res.data.products);
    } catch (err) {
      const message =
        err.response?.data?.message === "Session expired. Please login again."
          ? "Session expired! Please login to view your cart ❗"
          : "Error fetching cart ❌";
      console.error("Error fetching cart", err);
      setToast(message);
      setTimeout(() => setToast(null), 2000);
    }
  };
  

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      setToast("Item removed from cart 🗑️");
      fetchCartItems();
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      console.error("Error removing item", err);
      setToast("Error removing item ❌");
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    // 1. Optimistic UI update
    const updatedItems = cartItems.map((item) =>
      item.productId._id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCartItems(updatedItems);

    // 2. Sync with backend
    try {
      await updateCartQuantity(productId, newQuantity);
    } catch (err) {
      console.error("Error updating quantity", err);
      fetchCartItems(); // rollback if error
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    if (!item.productId) return sum;
    return sum + item.productId.price * item.quantity;
  }, 0);

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {toast && <div className="toast">{toast}</div>}

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                {item.productId ? (
                  <img
                    src={`http://localhost:5000/uploads/products/${item.productId.image}`}
                    alt={item.productId.name}
                  />
                ) : (
                  <p>Product info unavailable</p>
                )}

                <div className="item-details">
                  <h4>{item.productId.name}</h4>
                  <p>Price: ₹{item.productId.price}</p>

                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQuantityChange(item.productId._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>

                    <span className="qty">{item.quantity}</span>

                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQuantityChange(item.productId._id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item.productId._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
            <button className="checkout-btn" disabled>
              Checkout (Coming Soon)
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
