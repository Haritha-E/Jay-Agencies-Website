import axios from 'axios';

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
  return await axios.post(`${API_URL}/auth/signup`, userData);
};

export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/auth/login`, userData);
};

// ---------- PRODUCTS ----------
export const addProduct = async (formData) => {
  return await axios.post(`${API_URL}/products/add`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeaders().headers, // 👈 Add token here if needed
    },
  });
};

export const getProducts = async () => {
  return await axios.get(`${API_URL}/products`);
};

export const deleteProduct = async (id) => {
  return await axios.delete(`${API_URL}/products/${id}`, getAuthHeaders()); // 👈 Secure
};

export const updateProduct = async (id, formData) => {
  return await axios.put(`${API_URL}/products/edit/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeaders().headers,
    },
  });
};

// ---------- CART ----------
export const addToCart = async (productId) => {
  return await axios.post(
    `${API_URL}/cart/add`,
    { productId, quantity: 1 }, // 👈 ensure quantity is passed
    getAuthHeaders()
  );
};


export const getCartItems = async () => {
  return await axios.get(`${API_URL}/cart`, getAuthHeaders()); // 🔐 Protected route
};

export const removeFromCart = async (productId) => {
  return await axios.delete(`${API_URL}/cart/remove/${productId}`, getAuthHeaders()); // 🔐 Protected route
};

// Update quantity in cart
export const updateCartQuantity = async (productId, quantity) => {
  return await axios.put(
    `${API_URL}/cart/update`,
    { productId, quantity },
    getAuthHeaders()
  );
};

// ---------- WISHLIST ----------
export const addToWishlist = async (productId) => {
  return await axios.post(`${API_URL}/wishlist/add/${productId}`, {}, getAuthHeaders());
};

export const removeFromWishlist = async (productId) => {
  return await axios.delete(`${API_URL}/wishlist/remove/${productId}`, getAuthHeaders());
};

export const getWishlistItems = async () => {
  return await axios.get(`${API_URL}/wishlist`, getAuthHeaders());
};
