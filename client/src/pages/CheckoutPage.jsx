import React, { useEffect, useState } from "react";
import {
  getCartItems,
  getUserProfile,
  updateUserProfile,
  placeOrder,
  clearUserCart,
} from "../api";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [userData, setUserData] = useState({ phone: "", address: "" });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errors, setErrors] = useState({ phone: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    fetchUserDetails();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCartItems();
      setCartItems(res.data.products);
    } catch (err) {
      console.error("Error fetching cart");
    }
  };

  const fetchUserDetails = async () => {
    try {
      const res = await getUserProfile();
      setUserData({ phone: res.data.phone, address: res.data.address });
    } catch (err) {
      console.error("Error fetching user data");
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setErrors({ ...errors, phone: "Please enter a valid 10-digit phone number" });
      return false;
    }
    setErrors({ ...errors, phone: "" });
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    
    if (name === "phone") {
      validatePhone(value);
    }
  };

  const handleConfirmOrder = async () => {
    if (!userData.address.trim()) {
      alert("Delivery address is required to place an order.");
      return;
    }

    if (!validatePhone(userData.phone)) {
      return;
    }

    setIsPlacingOrder(true); // Show loader

    try {
      await updateUserProfile(userData);
      await placeOrder({ products: cartItems, ...userData });
      await clearUserCart();

      setOrderSuccess(true);
      setCartItems([]);

      setTimeout(() => {
        navigate("/my-orders", { replace: true });
      }, 3000);
    } catch (err) {
      console.error("Order failed", err);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    if (!item.productId) return sum;
    return sum + item.productId.price * item.quantity;
  }, 0);

  if (isPlacingOrder) {
    return (
      <div className="placing-order-container">
        <div className="loader"></div>
        <h2>Placing your order...</h2>
        <p>Please wait while we confirm and send you confirmation details.</p>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h2 className="success-message">Your order has been placed successfully!</h2>
        <h3 className="success-message">Your order will be delivered within 10 days!</h3>
        <p className="success-sub">Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Complete Your Order</h1>
        <p className="checkout-step">Review your items and delivery details</p>
      </div>
      
      <div className="checkout-layout">
        <div className="checkout-left">
          <div className="checkout-section check-order-summary">
            <h2>Order Summary</h2>
            {cartItems.length === 0 ? (
              <p className="empty-cart-message">Your cart is empty</p>
            ) : (
              <div className="order-items">
                {cartItems.map((item) => (
                  <div className="order-item" key={item._id}>
                    <div className="item-details">
                      <h3 className="item-name">{item.productId?.name}</h3>
                      <div className="item-meta">
                        <span className="item-quantity">Qty: {item.quantity}</span>
                        <span className="item-price">₹{item.productId?.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="item-subtotal">
                      ₹{(item.productId?.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="order-totals">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="delivery-fee">
                <span>Delivery Fee</span>
                <span>FREE</span>
              </div>
              <div className="final-total">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="checkout-right">
          <div className="checkout-section payment-info">
            <div className="payment-method-notice">
              <div className="cod-icon">₹</div>
              <div className="cod-details">
                <h3>Cash on Delivery Only</h3>
                <p>Pay with cash when your order is delivered</p>
              </div>
            </div>
          </div>
          
          <div className="checkout-section delivery-info">
            <h2>Delivery Information</h2>
            
            <div className="check-form-group">
              <label htmlFor="phone">Phone Number*</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={userData.phone}
                placeholder="Enter 10-digit phone number"
                onChange={handleChange}
                className={errors.phone ? "input-error" : ""}
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
              <small className="input-help">Required for delivery coordination</small>
            </div>
            
            <div className="check-form-group">
              <label htmlFor="address">Delivery Address*</label>
              <textarea
                id="address"
                name="address"
                value={userData.address}
                placeholder="Enter complete delivery address with pincode"
                onChange={handleChange}
                rows="4"
              />
              <small className="input-help">Please provide full address including city, state and PIN code</small>
            </div>
          </div>
          
          <button
            className="place-order-btn"
            onClick={() => setShowConfirmModal(true)}
            disabled={cartItems.length === 0}
          >
            Place Order
          </button>
        </div>
      </div>
      
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Your Order</h2>
            <div className="modal-content">
              <p>You're about to place an order for ₹{totalPrice.toFixed(2)}</p>
              <p className="modal-info">Cash on delivery payment will be collected upon delivery</p>
              <div className="modal-delivery-details">
                <p><strong>Phone:</strong> {userData.phone}</p>
                <p><strong>Address:</strong> {userData.address}</p>
              </div>
            </div>
            <div className="modal-buttons">
              <button
                className="modal-confirm"
                onClick={() => {
                  setShowConfirmModal(false);
                  handleConfirmOrder();
                }}
              >
                Confirm Order
              </button>
              <button
                className="modal-cancel"
                onClick={() => setShowConfirmModal(false)}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;