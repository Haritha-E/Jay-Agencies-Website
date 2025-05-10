import axios from 'axios';
import { toast } from "react-toastify";


export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
      ...getAuthHeaders().headers, 
    },
  });
};

export const getProducts = async () => {
  return await axios.get(`${API_URL}/api/products`);
};

export const deleteProduct = async (id) => {
  return await axios.delete(`${API_URL}/api/products/${id}`, getAuthHeaders()); 
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
  const token = localStorage.getItem("token");
  if (!token) {
    toast.warning("Please login to add items to cart");
    return;
  }

  try {
    const response = await axios.post(
      `${API_URL}/api/cart/add`,
      { productId, quantity: 1 },
      getAuthHeaders()
    );
    return response.data.cart;
  } catch (error) {
    throw error;
  }
};


export const validateCartStock = async() =>{
  return await axios.get(`${API_URL}/api/cart/validate-stock`, getAuthHeaders()); 
  };

export const getCartItems = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { data: { products: [] } }; // Matches expected structure
  }

  try {
    const response = await axios.get(`${API_URL}/api/cart`, getAuthHeaders());
    return response.data ? { data: response.data } : { data: { products: [] } };
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return { data: { products: [] } };
  }
};

export const removeFromCart = async (productId) => {
  return await axios.delete(`${API_URL}/api/cart/remove/${productId}`, getAuthHeaders()); 
};


export const updateCartQuantity = async (productId, quantity) => {
  return await axios.put(
    `${API_URL}/api/cart/update`,
    { productId, quantity },
    getAuthHeaders()
  );
};

// ---------- WISHLIST ----------
export const addToWishlist = async (productId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.warning("Please login to add items to wishlist");
    return false;
  }

  try {
    await axios.post(`${API_URL}/api/wishlist/add/${productId}`, {}, getAuthHeaders());
    return true;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return false;
  }
};



export const removeFromWishlist = async (productId) => {
  return await axios.delete(`${API_URL}/api/wishlist/remove/${productId}`, getAuthHeaders());
};

export const getWishlistItems = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { data: [] }; 
  }

  try {
    const response = await axios.get(`${API_URL}/api/wishlist`, getAuthHeaders());
    return response.data ? { data: response.data } : { data: [] }; 
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    return { data: [] }; 
  }
};
// ---------- PROFILE ----------
export const getUserProfile = async () => {
  return await axios.get(`${API_URL}/api/users/profile`, getAuthHeaders());
};

// ---------- PROFILE ----------
export const updateUserProfile = async (formData) => {
  return await axios.put(`${API_URL}/api/users/profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", 
      ...getAuthHeaders().headers,
    },
  });
};

// ---------- ORDERS ----------
export const placeOrder = async (orderData) => {
  return await axios.post(`${API_URL}/api/orders`, orderData, getAuthHeaders());
};


export const getUserOrders = async () => {
  return await axios.get(`${API_URL}/api/orders/myorders`, getAuthHeaders());
};


export const getAllOrders = async () => {
  return await axios.get(`${API_URL}/api/orders`, getAuthHeaders());
};


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

// ---------- RATINGS ----------
export const addOrUpdateRating = async (productId, ratingData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.warning("Please login to rate or review the product");
    return;
  }

  try {
    const response = await axios.post(`${API_URL}/api/ratings/${productId}`, ratingData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};



export const getRatings = async (productId) => {
  return await axios.get(`${API_URL}/api/ratings/${productId}`);
};


export const getMyRating = async (productId) => {
  return await axios.get(`${API_URL}/api/ratings/${productId}/my`, getAuthHeaders());
};


// ---------- SIMILAR PRODUCTS ---------
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
