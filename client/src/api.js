import axios from 'axios';

// Ensure API URL is set (fallback to localhost if not defined)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Register user (Signup)
export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/auth/signup`, userData); // Changed to `/auth/signup` to match backend
};

// Login user
export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/auth/login`, userData); // Changed to `/auth/login` to match backend
};

export const addProduct = async (formData) => {
  return await axios.post(`${API_URL}/products/add`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProducts = async () => {
  return await axios.get(`${API_URL}/products`);
};

export const deleteProduct = async (id) => {
  return await axios.delete(`${API_URL}/products/${id}`);
};

export const updateProduct = async (id, formData) => {
  return await axios.put(`${API_URL}/products/edit/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
