import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowCircleRight, FaHome, FaBoxOpen, FaPhoneAlt } from "react-icons/fa";
import "./Home.css";
import { getProducts, API_URL } from "../api";

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data.slice(0, 7));
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  return (
    <div className="home-container">
      {/* Professional Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-header">
            <h1 className="hero-title">
              {user?.name ? `Welcome, ${user.name}` : "Welcome to Jay Agencies"}
            </h1>
            <h2 className="hero-subtitle">Premium Kitchenware Distribution</h2>
          </div>
          
          <div className="hero-main-info">
            <p className="hero-description">
              Established in 2014, Jay Agencies is Salem's leading distributor of high-quality kitchenware 
              and home essentials. We serve retailers and businesses with premium products that combine 
              functionality, durability, and elegant design.
            </p>
          </div>
          
          <div className="hero-stats-row">
            <div className="hero-stat">
              <span className="stat-number">10+</span>
              <span className="home-stat-label">Years Experience</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">100+</span>
              <span className="home-stat-label">Products</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">50+</span>
              <span className="home-stat-label">Business Partners</span>
            </div>
          </div>
          
          <div className="hero-buttons">
            <button 
              className="primary-button"
              onClick={() => navigate("/products")}
            >
              Browse Collection
            </button>
            <button 
              className="secondary-button"
              onClick={() => document.getElementById("about-us").scrollIntoView({ behavior: "smooth" })}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section id="about-us" className="about-section">
        <div className="section-header">
          <h2>About Jay Agencies</h2>
          <div className="section-underline"></div>
        </div>
        <div className="about-content">
          <div className="about-image">
            <img 
              src="https://i.ytimg.com/vi/_yhvQZOasAI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDcDKLNl-Elvv1ClACOQVjSDXELDQ" 
              alt="About Jay Agencies" 
            />
          </div>
          <div className="about-text">
            <h3>Your Trusted Partner Since 2014</h3>
            <p>
              Jay Agencies has been a leading distributor of premium kitchenware and home essentials 
              in Salem for over a decade. We pride ourselves on curating products that combine 
              functionality, durability, and elegant design.
            </p>
            <p>
              Our mission is to enhance everyday living by providing high-quality products that make 
              cooking and home maintenance more efficient and enjoyable.
            </p>
            <div className="about-features">
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div className="feature-text">Premium Quality Products</div>
              </div>
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div className="feature-text">Extensive Product Range</div>
              </div>
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div className="feature-text">Professional Customer Service</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="featured-products" className="products-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <div className="section-underline"></div>
        </div>
        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product._id}
              className="home-product-card"
              onClick={() => navigate(`/products?search=${encodeURIComponent(product.name)}`)}
            >
              <div className="product-image-container">
                <img
                  src={`${API_URL}/uploads/products/${product.image}`}
                  alt={product.name}
                  className="home-product-image"
                />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-overlay">
                  <span>View Details</span>
                </div>
              </div>
            </div>
          ))}
          <div 
            className="product-card view-more-card" 
            onClick={() => navigate("/products")}
          >
            <div className="view-more-content">
              <FaArrowCircleRight className="view-more-icon" />
              <p>Explore All Products</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-choose-section">
        <div className="section-header">
          <h2>Why Choose Us</h2>
          <div className="section-underline"></div>
        </div>
        <div className="features-container">
          <div className="feature-box">
            <div className="feature-icon-large">
              <img src="https://cdn-icons-png.flaticon.com/512/1147/1147331.png" alt="Quality" />
            </div>
            <h3>Premium Quality</h3>
            <p>Carefully selected products that pass our rigorous quality standards</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon-large">
              <img src="https://cdn-icons-png.flaticon.com/512/3500/3500833.png" alt="Customer Service" />
            </div>
            <h3>Expert Support</h3>
            <p>Dedicated customer service team to assist with all your needs</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon-large">
              <img src="https://cdn-icons-png.flaticon.com/512/2271/2271113.png" alt="Shipping" />
            </div>
            <h3>Fast Delivery</h3>
            <p>Quick and reliable shipping to get your products to you on time</p>
          </div>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer-top-pattern"></div>
        <div className="footer-container">
          <div className="footer-section">
            <h3>About Jay Agencies</h3>
            <p>Your trusted destination for high-quality kitchenware & home essentials since 1995. We bring elegance and efficiency to homes across Salem and beyond.</p>
          </div>

          <div className="footer-section">
            <h3>Contact Information</h3>
            <div className="contact-info">
              <p><strong>Address:</strong> 36 Natesan Colony, Shankar Nagar, Salem-636007</p>
              <p><strong>Phone:</strong> E. Ravi | <a href="tel:+919876543210">+91 98765 43210</a></p>
              <p><strong>Email:</strong> <a href="mailto:jayagencies_1@yahoo.com">jayagencies_1@yahoo.com</a></p>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/"><FaHome className="footer-icon" /> Home</Link></li>
              <li><Link to="/products"><FaBoxOpen className="footer-icon" /> Products</Link></li>
              <li><Link to="/contact"><FaPhoneAlt className="footer-icon" /> Contact</Link></li>
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