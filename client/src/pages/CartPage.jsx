import React, { useEffect, useState } from "react";
import { getCartItems, removeFromCart, updateCartQuantity, API_URL, validateCartStock } from "../api";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [stockWarnings, setStockWarnings] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const res = await getCartItems();
      setCartItems(res.data.products);
    } catch (err) {
      const message =
        err.response?.data?.message === "Session expired. Please login again."
          ? "Session expired! Please login to view your cart"
          : "Error fetching cart";
      console.error("Error fetching cart", err);
      setToast(message);
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      setToast("Item removed from cart");
      fetchCartItems();
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error("Error removing item", err);
      setToast("Error removing item");
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await validateCartStock();
  
      if (res.data.ok) {
        navigate("/checkout");
      } else {
        const warnings = res.data.insufficientStock.map(
          (item) =>
            `${item.name}: only ${item.available} available, but you selected ${item.requested}`
        );
        setToast(warnings.join("\n"));
        setTimeout(() => setToast(null), 4000);
      }
    } catch (err) {
      console.error("Stock validation error", err);
      setToast("Error validating stock before checkout");
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
  
    const updatedItems = cartItems.map((item) =>
      item.productId._id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCartItems(updatedItems);
  
    try {
      await updateCartQuantity(productId, newQuantity);
      setStockWarnings((prev) => ({ ...prev, [productId]: null }));
    } catch (err) {
      console.error("Error updating quantity", err);
      const message = err.response?.data?.message || "Error updating quantity";
      setStockWarnings((prev) => ({ ...prev, [productId]: message }));
      fetchCartItems(); 
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    if (!item.productId) return sum;
    return sum + item.productId.price * item.quantity;
  }, 0);

  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <div className="cart-breadcrumb">
          <span className="active">Cart</span>
          <span className="separator">›</span>
          <span>Checkout</span>
          <span className="separator">›</span>
          <span>Confirmation</span>
        </div>
      </div>

      {toast && (
        <div className="toast-notification">
          <div className="toast-content">
            <span>{toast}</span>
            <button onClick={() => setToast(null)}>×</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your cart...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button className="continue-shopping" onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-container">
            <div className="cart-items-header">
              <div className="item-column">Product</div>
              <div className="price-column">Price</div>
              <div className="quantity-column">Quantity</div>
              <div className="subtotal-column">Subtotal</div>
              <div className="action-column"></div>
            </div>

            {cartItems.map((item) => (
              <div key={item._id} className="cart-item-row">
                <div className="item-column">
                  <div className="item-info">
                    {item.productId ? (
                      <img
                        src={`${API_URL}/uploads/products/${item.productId.image}`}
                        alt={item.productId.name}
                        className="item-image"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                    <div className="item-details">
                      <h3 className="item-name">{item.productId?.name || "Product unavailable"}</h3>
                      {item.productId?.category && (
                        <p className="item-category">{item.productId.category}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="price-column">
                  <span className="item-price">₹{item.productId?.price.toFixed(2)}</span>
                </div>

                <div className="quantity-column">
                  <div className="quantity-control">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      type="text"
                      className="quantity-input"
                      value={item.quantity}
                      readOnly
                    />
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                      disabled={item.productId?.stock && item.quantity >= item.productId.stock}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  {stockWarnings[item.productId?._id] && (
                    <p className="stock-warning">{stockWarnings[item.productId._id]}</p>
                  )}
                  {item.productId?.stock <= 5 && (
                    <p className="low-stock-warning">
                      Only {item.productId.stock} left in stock
                    </p>
                  )}
                </div>

                <div className="subtotal-column">
                  <span className="item-subtotal">
                    ₹{(item.productId?.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                <div className="action-column">
                  <button
                    className="remove-item-btn"
                    onClick={() => handleRemove(item.productId._id)}
                    aria-label="Remove item"
                  >
                    <span className="remove-icon">×</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-container">
            <div className="cart-summary-card">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span className="summary-value">₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>GST (18%)</span>
                <span className="summary-value">₹{gst.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span className="summary-value">FREE</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span className="summary-value total-value">₹{total.toFixed(2)}</span>
              </div>
              
              <button className="checkout-button" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              
              <button className="continue-shopping-link" onClick={() => navigate("/products")}>
                Continue Shopping
              </button>
            </div>
            
            <div className="cart-help">
              <h3>Need Help?</h3>
              <p>Contact our customer support at support@jayagencies.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;