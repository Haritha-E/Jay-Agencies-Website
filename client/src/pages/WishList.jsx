import React, { useEffect, useState } from "react";
import { getWishlistItems, removeFromWishlist, API_URL } from "../api";
import { useNavigate } from "react-router-dom";
import "./WishList.css";

const WishList = () => {
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const res = await getWishlistItems();
      setWishlist(res.data);
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      setToast("Error removing from wishlist ❗");
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="wishlist-page">
      <h2>Your Wishlist</h2>

      {toast && <div className="toast">{toast}</div>}

      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <div key={product._id} className="wishlist-card">
            <img
              src={`${API_URL}/uploads/products/${product.image}`}
              alt={product.name}
            />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>₹{product.price}</p>
            <p>Size: {product.size}</p>
            <div className="wishlist-actions">
              <button 
                className="view-button" 
                onClick={() => handleViewProduct(product._id)}
              >
                View Details
              </button>
              <button 
                className="remove-button" 
                onClick={() => handleRemove(product._id)}
              >
                Remove from Wishlist
              </button>
            </div>
          </div>
        ))}
        {wishlist.length === 0 && <p>No products in wishlist.</p>}
      </div>
    </div>
  );
};

export default WishList;
