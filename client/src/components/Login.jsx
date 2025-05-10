import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { loginUser } from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await loginUser({ 
        email: formData.email, 
        password: formData.password 
      });
      
      console.log("Login Response:", response.data);

      const user = response?.data?.user;
      const token = response?.data?.token;

      if (!user || !user.name || !user.id || !user.email) {
        throw new Error("Invalid response: Missing user information.");
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('role', user.isAdmin ? 'admin' : 'customer');
      
      toast.success(
        <div style={{ width: '400px' }}>Login successful!</div>,
        {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          closeButton: false,
        }
      );

      setTimeout(() => {
        onLogin({ 
          name: user.name, 
          email: user.email, 
          token, 
          isAdmin: user.isAdmin 
        });
        
        if (user.isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }, 2000);
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="log-login-container">
      <div className="log-login-brand-section">
        <div className="log-brand-content">
          <h1>Jay Agencies</h1>
          <p className="log-tagline">Professional Kitchenware Solutions</p>
          <div className="log-brand-features">
            <div className="log-feature">
              <i className="log-feature-icon quality-icon"></i>
              <span>Premium Quality Products</span>
            </div>
            <div className="log-feature">
              <i className="log-feature-icon global-icon"></i>
              <span>Global Shipping</span>
            </div>
            <div className="log-feature">
              <i className="log-feature-icon support-icon"></i>
              <span>24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="log-login-form-section">
        <div className="log-login-header">
          <img src="/jay_logo.png" alt="Jay Agencies Logo" className="log-logo" />
          <h2>Welcome Back</h2>
        </div>

        <form onSubmit={handleSubmit} className="log-login-form">
          {error && <p className="log-error-message">{error}</p>}
          
          <div className="log-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="log-form-group">
            <label htmlFor="password">Password</label>
            <div className="log-password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="log-eye-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <div className="log-forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="log-login-btn"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div className="log-register-prompt">
            <p>Don't have an account? <Link to="/signup">Register Now</Link></p>
          </div>
        </form>
        
        <div className="log-login-footer">
          <p>&copy; {new Date().getFullYear()} Jay Agencies - All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 