import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token") ? true : false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("token"); // Clear token on logout
    localStorage.removeItem("userId"); // Clear user ID
  };

  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Redirect to home if logged in, else show Login page */}
        <Route path="/" element={loggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={loggedIn ? <Navigate to="/home" /> : <Signup />} />
        
        {/* Home page - Only accessible if logged in */}
        <Route path="/home" element={loggedIn ? <Home onLogout={handleLogout} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
