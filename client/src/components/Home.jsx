import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowCircleRight } from "react-icons/fa";
import "./Home.css";
import { getProducts } from "../api";

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data.slice(0, 8));
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  return (
    <div className="home-container">
      {/* Banner Section */}
      <div className="banner-container">
        <img 
          src="https://img.freepik.com/premium-photo/different-kitchen-utensil-blue-wooden-background_185193-61976.jpg" 
          alt="Shop Banner" 
          className="banner-image"
        />
        <div className="welcome-section">
          <h2>
            {user?.name ? `Welcome, ${user.name}!` : "Welcome to Jay Agencies"}
          </h2>
          <p>Premium Kitchenware & Home Essentials – Crafted for Perfection!</p>
          <p className="tagline">✨ Bringing Elegance & Efficiency to Your Home ✨</p>
        </div>
      </div>

      {/* Our Products Section */}
      <h2 id="products" className="section-heading">Our Products</h2>

      {/* Product Grid */}
      <div className="home-product-grid">
        {products.map((product) => (
          <div
            key={product._id}
            className="product-card clickable"
            onClick={() => navigate(`/products?search=${encodeURIComponent(product.name)}`)}
          >
            <img
              src={`http://localhost:5000/uploads/products/${product.image}`}
              alt={product.name}
              className="product-image-home"
            />
            <h3>{product.name}</h3>
          </div>
        ))}

        {/* 9th Card - View More */}
        <div className="product-card view-more-card" onClick={() => navigate("/products")}>
          <FaArrowCircleRight size={30} />
          <p>View All Products</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="footer-container">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>Your trusted destination for high-quality kitchenware & home essentials.</p>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>📍 36 Natesan Colony, Shankar Nagar, Salem-636007</p>
            <p>📞 E. Ravi | <a href="tel:+919876543210">+91 98765 43210</a></p>
            <p>✉️ <a href="mailto:jayagencies_1@yahoo.com">jayagencies_1@yahoo.com</a></p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Jay Agencies | All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
