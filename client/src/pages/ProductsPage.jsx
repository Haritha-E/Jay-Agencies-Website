import React, { useEffect, useState } from "react";
import {
  getProducts,
  addToCart,
  addToWishlist,
  removeFromWishlist,
  getWishlistItems, // 👈 Add this
} from "../api";

import "./ProductsPage.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]); // local wishlist state
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, wishlistRes] = await Promise.all([
          getProducts(),
          getWishlistItems(),
        ]);
        setProducts(productsRes.data);
        setWishlistItems(wishlistRes.data.map((item) => item._id)); // just store productIds
      } catch (err) {
        console.error("Failed to load products or wishlist", err);
      }
    };
    fetchData();
  }, []);
  

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      setToast("Product added to cart ✅");
    } catch (err) {
      const message =
        err.response?.data?.message === "Session expired. Please login again."
          ? "Session expired! Please login to add to cart ❗"
          : "Please login to add to cart ❗";
      console.error("Error adding to cart", err);
      setToast(message);
    }
    setTimeout(() => setToast(null), 2000);
  };
  

  const handleToggleWishlist = async (productId) => {
    try {
      if (wishlistItems.includes(productId)) {
        await removeFromWishlist(productId);
        setWishlistItems((prev) => prev.filter((id) => id !== productId));
      } else {
        await addToWishlist(productId);
        setWishlistItems((prev) => [...prev, productId]);
      }
    } catch (err) {
      const message =
        err.response?.data?.message === "Session expired. Please login again."
          ? "Session expired! Please login to use wishlist ❗"
          : "Please login to use wishlist ❗";
      console.error("Wishlist error", err);
      setToast(message);
      setTimeout(() => setToast(null), 2000);
    }
  };
  

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesSize = sizeFilter ? product.size === sizeFilter : true;
    return matchesSearch && matchesSize;
  });

  return (
    <div className="products-page">
      <h2>Available Products</h2>

      {toast && <div className="toast">{toast}</div>}

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)}>
          <option value="">All Sizes</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-card">
            <div className="wishlist-icon" onClick={() => handleToggleWishlist(product._id)}>
              {wishlistItems.includes(product._id) ? "❤️" : "🤍"}
            </div>
            <img
              src={`http://localhost:5000/uploads/products/${product.image}`}
              alt={product.name}
            />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>₹{product.price}</p>
            <p>Size: {product.size}</p>
            <button onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
          </div>
        ))}
        {filteredProducts.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  );
};

export default ProductsPage;
