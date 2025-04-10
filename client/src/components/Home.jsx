import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa"; // 👈 Cart & Profile icons

const Home = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const products = [
    { id: 1, name: "Lunch Box", image: "https://vinodcookware.com/cdn/shop/products/1m0a5477_2.jpg?v=1738391972"},
    { id: 2, name: "Hot Box", image: "https://5.imimg.com/data5/YX/CU/FG/SELLER-28398783/plastic-casserole-hot-box.jpg"},
    { id: 3, name: "SS Container", image: "https://www.magnushomeware.com/cdn/shop/files/51OIosmXmCL_a1b04c63-9c51-48d4-87d4-fc5c683786e1_700x700.jpg?v=1735372814"},
    { id: 4, name: "Cutlery Set", image: "https://image.made-in-china.com/202f0j00zfRkDBldgAra/6PCS-Stainless-Steel-Cutlery-Set-Eating-Utensil-Home-Flatware-Knife-Fork-Spoon.webp"},
    { id: 5, name: "Kadai", image: "https://nutristar.co.in/cdn/shop/products/3_4f70eb75-1128-4fbf-860e-4b0d3797dff1_1024x1024.jpg?v=1670389688"},
    { id: 6, name: "SS Plates", image: "https://pramaniksteel.com/wp-content/uploads/2021/05/CRAFT_PLATE_1-1.jpg"},
    { id: 7, name: "SS Tea Cups", image: "https://sumeetcookware.in/cdn/shop/products/411TXcZS5cL_dee5f6cc-beb6-4ba2-a646-40c145eac3fa.jpg?v=1693642380"},
    { id: 8, name: "Revolving Chair", image: "https://www.jfa.in/product-images/RUH_ML-1289_Chair-min-scaled+%281%29.jpg/431189000027882178/300x300"},
    { id: 9, name: "Bed", image: "https://www.ikea.com/in/en/images/products/malm-bed-frame-with-mattress-white-valevag-firm__1150856_pe884904_s5.jpg?f=s"},
  ];

  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="home-header">
        <h1 className="shop-name">Jay Agencies</h1>
        <nav className="nav-menu">
          <Link to="/products">Products</Link>
          {user && <Link to="/wishlist">Wishlist</Link>}
          <a href="#contact">Contact</a>
        </nav>

        {user ? (
          <div className="nav-actions">
            <button className="icon-btn" onClick={() => navigate("/cart")}>
              <FaShoppingCart size={20} />
            </button>
            <button className="icon-btn" onClick={() => navigate("/profile")}>
              <FaUserCircle size={22} />
            </button>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <button onClick={() => navigate("/login")} className="logout-btn">Get Started</button>
        )}
      </header>

      {/* Banner Section */}
      <div className="banner-container">
        <img 
          src="https://img.freepik.com/premium-photo/different-kitchen-utensil-blue-wooden-background_185193-61976.jpg" 
          alt="Shop Banner" 
          className="banner-image"
        />
        <div className="welcome-section">
          <h2>
            {user && user.name ? `Welcome, ${user.name}!` : "Welcome to Jay Agencies"}
          </h2>
          <p>Premium Kitchenware & Home Essentials – Crafted for Perfection!</p>
          <p className="tagline">✨ Bringing Elegance & Efficiency to Your Home ✨</p>
        </div>
      </div>

      {/* Our Products Section */}
      <h2 id="products" className="section-heading">Our Products</h2>

      {/* Product Grid */}
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
          </div>
        ))}
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
              <li><a href="/">Home</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#contact">Contact</a></li>
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
