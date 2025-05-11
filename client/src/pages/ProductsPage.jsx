import React, { useEffect, useState } from "react";
import {
  getProducts,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getCartItems,
  addToWishlist,
  removeFromWishlist,
  getWishlistItems,
  API_URL,
} from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProductsPage.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [toast, setToast] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const querySearch = new URLSearchParams(location.search).get("search");
    if (querySearch) {
      setSearch(querySearch);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await getProducts();
        setProducts(productsRes.data);

        const cartRes = await getCartItems();
        setCartItems(cartRes.data.products);

        const wishlistRes = await getWishlistItems();
        setWishlistItems(wishlistRes.data.map((item) => item._id));
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      setToast("Product added to cart ✅");
      const cartRes = await getCartItems(); 
      setCartItems(cartRes.data.products);
    } catch (err) {
      const message =
        err.response?.data?.message === "Session expired. Please login again."
          ? "Session expired! Please login to add to cart ❗"
          : "Please login to add to cart ❗";
      setToast(message);
    }
    setTimeout(() => setToast(null), 2000);
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
      setToast("Item removed from cart 🗑️");
      const cartRes = await getCartItems(); 
      setCartItems(cartRes.data.products);
    } catch (err) {
      setToast("Error removing item ❌");
    }
    setTimeout(() => setToast(null), 2000);
  };

  const handleIncreaseQuantity = async (productId) => {
    const cartItem = cartItems.find((item) => item.productId._id === productId);
    const newQuantity = cartItem ? cartItem.quantity + 1 : 1;

    try {
      await updateCartQuantity(productId, newQuantity); 
      const cartRes = await getCartItems(); 
      setCartItems(cartRes.data.products);
    } catch (err) {
      console.error("Error increasing quantity", err);
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    const cartItem = cartItems.find((item) => item.productId._id === productId);
    const newQuantity = cartItem && cartItem.quantity > 1 ? cartItem.quantity - 1 : 1;

    try {
      await updateCartQuantity(productId, newQuantity); 
      const cartRes = await getCartItems();  
      setCartItems(cartRes.data.products);
    } catch (err) {
      console.error("Error decreasing quantity", err);
    }
  };

  const handleToggleWishlist = async (productId) => {
  try {
    if (wishlistItems.includes(productId)) {
      const success = await removeFromWishlist(productId);
      if (success) {
        setWishlistItems((prev) => prev.filter((id) => id !== productId));
      }
    } else {
      const success = await addToWishlist(productId);
      if (success) {
        setWishlistItems((prev) => [...prev, productId]);
      }
    }
  } catch (err) {
    const message =
      err.response?.data?.message === "Session expired. Please login again."
        ? "Session expired! Please login to use wishlist ❗"
        : "Please login to use wishlist ❗";
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  }
};


  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase());

    const matchesPrice =
      priceFilter === ""
        ? true
        : priceFilter === "Below 500"
        ? product.price < 500
        : priceFilter === "500-1000"
        ? product.price >= 500 && product.price <= 1000
        : product.price > 1000;

    return matchesSearch && matchesPrice;
  });

  const getCartQuantity = (productId) => {
    const cartItem = cartItems.find((item) => item.productId._id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

 return (
  <div className="prod-products-page">
    <h2>Available Products</h2>

    {toast && <div className="prod-toast">{toast}</div>}

    <div className="prod-filter-bar">
      <div className="prod-filter-group">
        <input
          type="text"
          className="prod-search-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="prod-price-filter">
        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
          <option value="">All Prices</option>
          <option value="Below 500">Below ₹500</option>
          <option value="500-1000">₹500 - ₹1000</option>
          <option value="Above 1000">Above ₹1000</option>
        </select>
      </div>
    </div>

    <div className="prod-product-grid">
      {filteredProducts.map((product) => (
        <div key={product._id} className="prod-product-card">
          <div
            className="prod-wishlist-icon"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleWishlist(product._id);
            }}
          >
            {wishlistItems.includes(product._id) ? "❤️" : "🤍"}
          </div>

          <div onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: "pointer" }}>
            <p className={`prod-stock-tag ${product.stock > 0 ? "available" : "out-of-stock"}`}>
              {product.stock > 0 ? "Available" : "Out of Stock"}
            </p>
            <img src={`${API_URL}/uploads/products/${product.image}`} alt={product.name} />
            <h3>{product.name}</h3>
            <p>Price: ₹{product.price}</p>
            <p>Size: {product.size}</p>
          </div>

          {getCartQuantity(product._id) > 0 ? (
            <>
              <div className="prod-quantity-controls">
                <button
                  className="prod-decrease-btn"
                  onClick={() => handleDecreaseQuantity(product._id)}
                  disabled={getCartQuantity(product._id) === 1}
                >
                  -
                </button>
                <span className="prod-qty">{getCartQuantity(product._id)}</span>
                <button
                  className="prod-increase-btn"
                  onClick={() => handleIncreaseQuantity(product._id)}
                  disabled={getCartQuantity(product._id) >= product.stock}
                >
                  +
                </button>
                <button
                  className="prod-delete-btn"
                  onClick={() => handleRemoveFromCart(product._id)}
                >
                  🗑️
                </button>
              </div>

              {getCartQuantity(product._id) >= product.stock && (
                <p className="prod-stock-warning">
                  Only {product.stock} left in stock
                </p>
              )}
            </>
          ) : (
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product._id);
                }}
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      ))}
      {filteredProducts.length === 0 && <p>No products found.</p>}
    </div>
  </div>
);

};

export default ProductsPage;