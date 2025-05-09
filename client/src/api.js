import axios from 'axios';

// Base API URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// 🔐 Helper to get token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ---------- AUTH ----------
export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/api/auth/signup`, userData);
};

export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/api/auth/login`, userData);
};

// ---------- PRODUCTS ----------
export const addProduct = async (formData) => {
  return await axios.post(`${API_URL}/api/products/add`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeaders().headers, // 👈 Add token here if needed
    },
  });
};

export const getProducts = async () => {
  return await axios.get(`${API_URL}/api/products`);
};

export const deleteProduct = async (id) => {
  return await axios.delete(`${API_URL}/api/products/${id}`, getAuthHeaders()); // 👈 Secure
};

export const updateProduct = async (id, formData) => {
  return await axios.put(`${API_URL}/api/products/edit/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeaders().headers,
    },
  });
};

// ---------- CART ----------
export const addToCart = async (productId) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/cart/add`,
      { productId, quantity: 1 }, // ensure quantity is passed
      getAuthHeaders()
    );
    return response.data.cart; // Return the updated cart data
  } catch (error) {
    throw error; // Handle error if needed
  }
};

export const validateCartStock = async() =>{
  return await axios.get(`${API_URL}/api/cart/validate-stock`, getAuthHeaders()); // 🔐 Protected route},
  };

export const getCartItems = async () => {
  return await axios.get(`${API_URL}/api/cart`, getAuthHeaders()); // 🔐 Protected route
};

export const removeFromCart = async (productId) => {
  return await axios.delete(`${API_URL}/api/cart/remove/${productId}`, getAuthHeaders()); // 🔐 Protected route
};

// Update quantity in cart
export const updateCartQuantity = async (productId, quantity) => {
  return await axios.put(
    `${API_URL}/api/cart/update`,
    { productId, quantity },
    getAuthHeaders()
  );
};

// ---------- WISHLIST ----------
export const addToWishlist = async (productId) => {
  return await axios.post(`${API_URL}/api/wishlist/add/${productId}`, {}, getAuthHeaders());
};

export const removeFromWishlist = async (productId) => {
  return await axios.delete(`${API_URL}/api/wishlist/remove/${productId}`, getAuthHeaders());
};

export const getWishlistItems = async () => {
  return await axios.get(`${API_URL}/api/wishlist`, getAuthHeaders());
};

// ---------- PROFILE ----------
export const getUserProfile = async () => {
  return await axios.get(`${API_URL}/api/users/profile`, getAuthHeaders());
};

// ---------- PROFILE ----------
export const updateUserProfile = async (formData) => {
  return await axios.put(`${API_URL}/api/users/profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // 👈 for file uploads
      ...getAuthHeaders().headers,
    },
  });
};

// ---------- ORDERS ----------

// 🧾 Place a new order
export const placeOrder = async (orderData) => {
  return await axios.post(`${API_URL}/api/orders`, orderData, getAuthHeaders());
};

// 📦 Get user's placed and received orders
export const getUserOrders = async () => {
  return await axios.get(`${API_URL}/api/orders/myorders`, getAuthHeaders());
};

// 🛠 Admin: Get all orders
export const getAllOrders = async () => {
  return await axios.get(`${API_URL}/api/orders`, getAuthHeaders());
};

// ✅ Admin: Mark an order as delivered
export const markOrderDelivered = async (orderId) => {
  return await axios.put(`${API_URL}/api/orders/deliver/${orderId}`, {}, getAuthHeaders());
};

export const clearUserCart = () => {
  return axios.delete(`${API_URL}/api/cart/clear`, getAuthHeaders());
};


export const getProduct = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add or update a rating for a product
export const addOrUpdateRating = async (productId, ratingData) => {
  try {
    const response = await axios.post(`${API_URL}/api/ratings/${productId}`, ratingData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


// Get all ratings for a product
export const getRatings = async (productId) => {
  return await axios.get(`${API_URL}/api/ratings/${productId}`);
};

// Get the current user's rating for a product
export const getMyRating = async (productId) => {
  return await axios.get(`${API_URL}/api/ratings/${productId}/my`, getAuthHeaders());
};


// Get similar products
export const getSimilarProducts = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/api/products/similar/${productId}`);
    console.log("Similar products API response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`No similar products found for product ID: ${productId}`, error.message);
    return [];
  }
};


// 📊 Admin: Get sales report
export const getSalesReport = async (queryString = "") => {
  try {
    const response = await axios.get(
      `${API_URL}/api/orders/sales-report?${queryString}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching sales report:", error);
    throw error;
  }
};

// ---------- ANALYTICS ----------
export const getTopSoldProducts = async () => {
  return await axios.get(`${API_URL}/api/analytics/top-sold-products`, getAuthHeaders());
};

export const getTopRatedProducts = async () => {
  return await axios.get(`${API_URL}/api/analytics/top-rated-products`, getAuthHeaders());
};

export const getYearlyTurnover = async () => {
  return await axios.get(`${API_URL}/api/analytics/turnover/yearly`, getAuthHeaders());
};

export const getMonthlyTurnover = async () => {
  return await axios.get(`${API_URL}/api/analytics/turnover/monthly`, getAuthHeaders());
};

export const getTopCustomers = async () => {
  return await axios.get(`${API_URL}/api/analytics/top-customers`, getAuthHeaders());
};
