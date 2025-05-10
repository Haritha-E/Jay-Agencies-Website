import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getProduct,
  addToCart,
  addToWishlist,
  removeFromWishlist,
  getRatings,
  getWishlistItems,
  getCartItems,
  addOrUpdateRating,
  getSimilarProducts,
  removeFromCart,
  updateCartQuantity,
  API_URL,
} from "../api";
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar, FaTrash } from "react-icons/fa";
import { RiShoppingCart2Line } from "react-icons/ri";
import "./ProductDetails.css";

let toastTimeout;

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setProduct(null);
        setRatings([]);
        setSimilarProducts([]);
  
        const productData = await getProduct(id);
        setProduct(productData);
  
        const ratingsRes = await getRatings(id);
        setRatings(ratingsRes.data);
  
        const wishlistRes = await getWishlistItems();
        setWishlistItems(wishlistRes.data.map((item) => item._id));
  
        const cartRes = await getCartItems();
        setCartItems(cartRes.data.products);
  
        const similarProductsData = await getSimilarProducts(id);
        setSimilarProducts(Array.isArray(similarProductsData) ? similarProductsData : []);
  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };
  
    window.scrollTo(0, 0);
    if (id) {
      fetchProductDetails();
    }
  }, [id]);
  
  const showToast = (message) => {
    setToast(message);
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => setToast(null), 2000);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id);
      const cartRes = await getCartItems();
      setCartItems(cartRes.data.products);
      showToast("Product added to cart ✅");
    } catch (error) {
      const message =
        error.response?.data?.message === "Session expired. Please login again."
          ? "Session expired! Please login to add to cart ❗"
          : "Please login to add to cart ❗";
      showToast(message);
    }
  };

const handleToggleWishlist = async () => {
  try {
    if (wishlistItems.includes(product._id)) {
      const res = await removeFromWishlist(product._id);
      if (res) {
        setWishlistItems((prev) => prev.filter((id) => id !== product._id));
        showToast("Removed from wishlist ❌");
      }
    } else {
      const success = await addToWishlist(product._id);
      if (success) {
        setWishlistItems((prev) => [...prev, product._id]);
        showToast("Added to wishlist ❤️");
      }
    }
  } catch (error) {
    const message =
      error.response?.data?.message === "Session expired. Please login again."
        ? "Session expired! Please login to use wishlist ❗"
        : "Please login to use wishlist ❗";
    showToast(message);
  }
};


  const handleSubmitReview = async () => {
    try {
      const ratingData = { rating: ratingValue, feedback };
      await addOrUpdateRating(product._id, ratingData);
      showToast("Review added successfully 👍");
      setRatingValue(0);
      setFeedback("");

      const updatedRatingsRes = await getRatings(id);
      setRatings(updatedRatingsRes.data);
    } catch (error) {
      showToast("Error submitting review ❌");
      console.error("Error submitting review:", error);
    }
  };

  const getCartQuantity = (productId) => {
    const cartItem = cartItems.find((item) => 
      (typeof item.productId === 'object' ? item.productId._id : item.productId) === productId
    );
    return cartItem ? cartItem.quantity : 0;
  };

  const handleIncreaseQuantity = async (productId) => {
    const cartItem = cartItems.find((item) => 
      (typeof item.productId === 'object' ? item.productId._id : item.productId) === productId
    );
    const newQuantity = cartItem ? cartItem.quantity + 1 : 1;

    try {
      await updateCartQuantity(productId, newQuantity);
      const cartRes = await getCartItems();
      setCartItems(cartRes.data.products);
      showToast("Cart updated ✅");
    } catch (err) {
      showToast("Error updating cart ❌");
      console.error("Error increasing quantity", err);
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    const cartItem = cartItems.find((item) => 
      (typeof item.productId === 'object' ? item.productId._id : item.productId) === productId
    );
    const newQuantity = cartItem && cartItem.quantity > 1 ? cartItem.quantity - 1 : 1;

    try {
      await updateCartQuantity(productId, newQuantity);
      const cartRes = await getCartItems();
      setCartItems(cartRes.data.products);
      showToast("Cart updated ✅");
    } catch (err) {
      showToast("Error updating cart ❌");
      console.error("Error decreasing quantity", err);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
      showToast("Item removed from cart 🗑️");
      const cartRes = await getCartItems();
      setCartItems(cartRes.data.products);
    } catch (err) {
      showToast("Error removing item ❌");
    }
  };

  const averageRating = ratings.length
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
    : 0;

  const renderStarRating = (rating) => {
    const stars = [];
    
    for (let i = 1; i <= Math.floor(rating); i++) {
      stars.push(<FaStar key={`star-${i}`} className="d1-star d1-filled" />);
    }
    
    if (rating % 1 >= 0.5) {
      stars.push(<FaStarHalfAlt key="half-star" className="d1-star d1-half" />);
    }
    
    while (stars.length < 5) {
      stars.push(<FaRegStar key={`empty-star-${stars.length}`} className="d1-star d1-empty" />);
    }
    
    return <div className="d1-star-rating">{stars}</div>;
  };

  if (loading || !product) {
    return (
      <div className="d1-product-details-container">
        <div className="d1-loader"></div>
      </div>
    );
  }

  return (
    <div className="d1-product-details-page">
      {toast && <div className="d1-toast-notification">{toast}</div>}
      
      <div className="d1-breadcrumb">
        <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <span>{product.name}</span>
      </div>

      <div className="d1-product-showcase">
        <div className="d1-product-gallery">
          <div className="d1-main-image-container">
            {imageLoading && <div className="d1-image-loader"></div>}
            <img
              src={`${API_URL}/uploads/products/${product.image}`}
              alt={product.name}
              className="d1-main-product-image"
              onLoad={() => setImageLoading(false)}
              style={{ opacity: imageLoading ? 0 : 1 }}
            />
          </div>
        </div>

        <div className="d1-product-information">
          <div className="d1-product-header">
            <h1 className="d1-product-title">{product.name}</h1>
            
            <button 
              className="d1-wishlist-button" 
              onClick={handleToggleWishlist}
              aria-label={wishlistItems.includes(product._id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              {wishlistItems.includes(product._id) ? 
                <FaHeart className="d1-heart-icon d1-filled-heart" /> : 
                <FaRegHeart className="d1-heart-icon" />
              }
            </button>
          </div>
          
          <div className="d1-product-meta">
            <div className="d1-rating-summary">
              {renderStarRating(averageRating)}
              <span className="d1-rating-count">({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})</span>
            </div>
            
            <div className={`d1-stock-indicator ${product.stock > 0 ? "d1-in-stock" : "d1-out-of-stock"}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
            </div>
          </div>

          <div className="d1-product-pricing">
            <span className="d1-current-price">₹{product.price}</span>
          </div>

          <div className="d1-product-size">
            <span className="d1-size-label">Size:</span>
            <span className="d1-size-value">{product.size}</span>
          </div>

          <div className="d1-product-actions">
            {getCartQuantity(product._id) > 0 ? (
                <div className="d1-cart-controls">
                  <div className="d1-quantity-selector">
                    <button
                      className="d1-quantity-btn"
                      onClick={() => handleDecreaseQuantity(product._id)}
                      disabled={getCartQuantity(product._id) === 1}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="d1-quantity-value">{getCartQuantity(product._id)}</span>
                    <button
                      className="d1-quantity-btn"
                      onClick={() => handleIncreaseQuantity(product._id)}
                      disabled={getCartQuantity(product._id) >= product.stock}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="d1-remove-from-cart-btn"
                    onClick={() => handleRemoveFromCart(product._id)}
                    aria-label="Remove from cart"
                  >
                    <FaTrash className="d1-trash-icon" /> Remove
                  </button>
                </div>
              ) : (
                <button
                  className="d1-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <RiShoppingCart2Line /> Add to Cart
                </button>
            )}
          </div>

          {getCartQuantity(product._id) >= product.stock && product.stock > 0 && (
            <p className="d1-stock-warning">
              Maximum quantity reached for this product
            </p>
          )}

          <div className="d1-product-tabs">
            <div className="d1-tab-headers">
              <button 
                className={`d1-tab-btn ${activeTab === 'description' ? 'd1-active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`d1-tab-btn ${activeTab === 'reviews' ? 'd1-active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({ratings.length})
              </button>
            </div>
            
            <div className="d1-tab-content">
              {activeTab === 'description' && (
                <div className="d1-description-tab">
                  <p>{product.description}</p>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="d1-reviews-tab">
                  <div className="d1-reviews-list">
                    {ratings.length > 0 ? (
                      ratings.map((rating, index) => (
                        <div key={index} className="d1-review-item">
                          <div className="d1-review-header">
                            <span className="d1-reviewer-name">{rating.userId ? rating.userId.name : "Anonymous"}</span>
                            {renderStarRating(rating.rating)}
                          </div>
                          <p className="d1-review-text">{rating.feedback}</p>
                        </div>
                      ))
                    ) : (
                      <p className="d1-no-reviews">No reviews yet. Be the first to leave a review!</p>
                    )}
                  </div>
                  
                  <div className="d1-review-form">
                    <h3>Write a Review</h3>
                    <div className="d1-rating-selection">
                      <label>Your Rating:</label>
                      <select
                        value={ratingValue}
                        onChange={(e) => setRatingValue(Number(e.target.value))}
                        className="d1-rating-select"
                      >
                        <option value={0}>Select</option>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Star' : 'Stars'}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="d1-feedback-input-container">
                      <label htmlFor="feedback">Your Review:</label>
                      <textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Share your experience with this product..."
                        className="d1-feedback-textarea"
                      />
                    </div>
                    
                    <button
                      className="d1-submit-review-btn"
                      onClick={handleSubmitReview}
                      disabled={ratingValue === 0 || feedback.trim().length === 0}
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="d1-similar-products-section">
        <h2 className="d1-section-title">You May Also Like</h2>
        <div className="d1-similar-products-grid">
          {similarProducts.length > 0 ? (
            similarProducts.map((similarProduct) => (
              <Link
                key={similarProduct._id}
                to={`/product/${similarProduct._id}`}
                className="d1-product-card"
              >
                <div className="d1-product-card-image">
                  <img
                    src={`${API_URL}/uploads/products/${similarProduct.image}`}
                    alt={similarProduct.name}
                    loading="lazy"
                  />
                </div>
                <div className="d1-product-card-info">
                  <h3 className="d1-product-card-name">{similarProduct.name}</h3>
                  <p className="d1-product-card-price">₹{similarProduct.price}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="d1-no-similar-products">No similar products available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;