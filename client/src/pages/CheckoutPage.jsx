import React, { useEffect, useState } from "react";
import { getCartItems, getUserProfile, updateUserProfile, placeOrder, clearUserCart } from "../api";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userData, setUserData] = useState({ phone: "", address: "" });
  const [orderSuccess, setOrderSuccess] = useState(false);
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

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async () => {
    if (!userData.phone.trim() || !userData.address.trim()) {
      alert("Phone number and address are required to place an order.");
      return;
    }
  
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
    }
  };
  

  const totalPrice = cartItems.reduce((sum, item) => {
    if (!item.productId) return sum;
    return sum + item.productId.price * item.quantity;
  }, 0);

  if (orderSuccess) {
    return (
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h2 className="success-message">Your order has been placed successfully!</h2>
        <p className="success-sub">Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <table className="checkout-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price (₹)</th>
            <th>Subtotal (₹)</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item._id}>
              <td>{item.productId?.name}</td>
              <td>{item.quantity}</td>
              <td>{item.productId?.price.toFixed(2)}</td>
              <td>{(item.productId?.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="billing-summary">
        <h3>Total Amount: ₹{totalPrice.toFixed(2)}</h3>

        <div className="contact-section">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="text"
            name="phone"
            value={userData.phone}
            placeholder="Enter phone number"
            onChange={handleChange}
          />

          <label htmlFor="address">Delivery Address</label>
          <textarea
            id="address"
            name="address"
            value={userData.address}
            placeholder="Enter full address"
            onChange={handleChange}
          />
        </div>

        <button className="confirm-btn" onClick={handleConfirmOrder}>
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
