import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManageProducts from "./pages/AdminManageProducts";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import WishList from "./pages/WishList";
import Profile from "./pages/Profile";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrders from "./pages/MyOrders";
import AdminManageOrders from "./pages/AdminManageOrders";

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token") ? true : false);
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");

    if (token && name && email) {
      setLoggedIn(true);
      setUserName(name);
      setUserEmail(email);
    }
  }, []);

  const handleLogin = (user) => {
    if (!user || !user.name || !user.email) {
      console.error("Invalid user object on login:", user);
      return;
    }
  
    setLoggedIn(true);
    setUserName(user.name);
    setUserEmail(user.email);
    localStorage.setItem("token", user.token);
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userEmail", user.email);
  };
  

  const handleLogout = () => {
    setLoggedIn(false);
    setUserName("");
    setUserEmail("");
    localStorage.clear();
  };

  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Always accessible home page */}
              <Route
        path="/"
        element={
          loggedIn && !userName ? (
            <div>Loading...</div> // or a spinner
          ) : (
            <Home user={loggedIn ? { name: userName, email: userEmail } : null} onLogout={handleLogout} />
          )
        }
      />
        <Route path="/login" element={loggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={loggedIn ? <Navigate to="/" /> : <Signup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard onLogout={handleLogout} />} />
        <Route path="/admin/products" element={<AdminManageProducts />} />
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route path="/admin/products/edit/:id" element={<EditProduct />} />     
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/admin/orders" element={<AdminManageOrders />} />


      </Routes>
    </Router>
  );
}

export default App;
