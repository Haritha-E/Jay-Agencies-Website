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
} from "../api";
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
        const cartProductIds = cartRes.data.products.map((item) =>
          typeof item.productId === "object" ? item.productId._id : item.productId
        );
        setCartItems(cartProductIds);
  
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
      const cartProductIds = cartRes.data.products.map((item) =>
        typeof item.productId === "object" ? item.productId._id : item.productId
      );
      setCartItems(cartProductIds);
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
        await removeFromWishlist(product._id);
        setWishlistItems((prev) => prev.filter((id) => id !== product._id));
        showToast("Removed from wishlist ❌");
      } else {
        await addToWishlist(product._id);
        setWishlistItems((prev) => [...prev, product._id]);
        showToast("Added to wishlist ❤️");
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

  const averageRating = ratings.length
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
    : 0;

  const starRating = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    return (
      <span>
        {"★".repeat(fullStars)}
        {halfStar && "⯨"}
        {"☆".repeat(5 - fullStars - (halfStar ? 1 : 0))}
      </span>
    );
  };

  if (loading || !product) {
    return (
      <div className="product-details-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      {toast && <div className="toast">{toast}</div>}

      <div className="product-details">
        <div className="product-image">
          <img
            src={`http://localhost:5000/uploads/products/${product.image}`}
            alt={product.name}
            className="product-img"
          />
        </div>

        <div className="product-info">
          <div className="wishlist-toggle" onClick={handleToggleWishlist}>
            {wishlistItems.includes(product._id) ? "❤️" : "🤍"}
          </div>

          <h2 className="product-name">{product.name}</h2>
          <div className="product-rating">
            <h4>
              Rating: {starRating(averageRating)} ({averageRating.toFixed(1)} / 5)
            </h4>
          </div>
          <p className="product-price">₹{product.price}</p>
          <p className="product-description">{product.description}</p>
          <p className="product-size">Size: {product.size}</p>

          <div className="product-actions">
            <button
              className="btn add-to-cart"
              onClick={handleAddToCart}
              disabled={cartItems.includes(product._id)}
            >
              {cartItems.includes(product._id) ? "Added to Cart" : "Add to Cart"}
            </button>
          </div>

          <div className="product-rating">
            <h4>Customer Reviews</h4>
            <div className="ratings">
              {ratings.length > 0 ? (
                ratings.map((rating, index) => (
                  <div key={index} className="rating-item">
                    <div className="rating-user">
                      User: {rating.userId ? rating.userId.name : "Unknown"}
                    </div>
                    <div className="rating-feedback">{rating.feedback}</div>
                    <div className="rating-value">
                      Rating: {starRating(rating.rating)}
                    </div>
                  </div>
                ))
              ) : (
                <p>No ratings yet. Be the first to review!</p>
              )}
            </div>

            <div className="add-review">
              <h4>Submit Your Review</h4>
              <div className="review-inputs">
                <select
                  value={ratingValue}
                  onChange={(e) => setRatingValue(Number(e.target.value))}
                  className="rating-input"
                >
                  <option value={0} disabled>
                    Select Rating
                  </option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>

                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Write your feedback..."
                  className="feedback-input"
                />
                <button
                  className="btn submit-review"
                  onClick={handleSubmitReview}
                  disabled={
                    ratingValue < 1 ||
                    ratingValue > 5 ||
                    feedback.trim().length === 0
                  }
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="similar-products">
        <h3>Similar Products</h3>
        <div className="similar-products-list">
          {similarProducts.length > 0 ? (
            similarProducts.map((similarProduct) => (
              <Link
                key={similarProduct._id}
                to={`/product/${similarProduct._id}`}
                className="similar-product-item"
              >
                <img
                  src={`http://localhost:5000/uploads/products/${similarProduct.image}`}
                  alt={similarProduct.name}
                  className="similar-product-img"
                />
                <p className="similar-product-name">{similarProduct.name}</p>
                <p className="similar-product-price">₹{similarProduct.price}</p>
              </Link>
            ))
          ) : (
            <p>No similar products available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
