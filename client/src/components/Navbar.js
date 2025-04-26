import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="home-header">
      {/* Clickable Jay Agencies heading */}
      <Link to="/" className="shop-name">
        Jay Agencies
      </Link>

      <nav className="nav-menu">
        <Link to="/products">Products</Link>
        {user && (
          <>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/my-orders">My Orders</Link>
          </>
        )}
        <a href="/#contact">Contact</a>
      </nav>

      {user ? (
        <div className="nav-actions">
          <button className="icon-btn" onClick={() => navigate("/cart")}>
            <FaShoppingCart size={20} />
          </button>
          <button className="icon-btn" onClick={() => navigate("/profile")}>
            <FaUserCircle size={22} />
          </button>
          <button onClick={onLogout} className="logout-btn-nav">
            Logout
          </button>
        </div>
      ) : (
        <button onClick={() => navigate("/login")} className="logout-btn-nav">
          Get Started
        </button>
      )}
    </header>
  );
};

export default Navbar;
