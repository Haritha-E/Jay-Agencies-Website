import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Reuse the same CSS
import { registerUser } from '../api'; // API function
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user types
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const validateEmail = (email) => {
    // More comprehensive email validation regex
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset all error messages
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    
    // Validate name (should not be empty)
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    // Validate email format
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long and contain at least one special character.';
    }

    // Check if passwords match
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match!';
    }

    // Check if there are any errors
    if (newErrors.name || newErrors.email || newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors);
      return;
    }

    // Register the user
    try {
      setLoading(true);
      await registerUser({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password 
      });

      // Show success toast notification
      toast.success(
        <div style={{ width: '400px' }}>
          Registration successful!
          <br />
          Redirecting to login...
        </div>,
        {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          closeButton: false,
        }
      );

      // Redirect to login page after a delay
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 400 && error.response.data.message === "User already exists") {
          setErrors({
            ...errors,
            email: 'This email is already registered. Please use a different email or login instead.'
          });
        } else {
          setErrors({
            ...errors,
            email: error.response.data.message || 'Registration failed. Please try again.'
          });
        }
      } else if (error.request) {
        // The request was made but no response was received
        setErrors({
          ...errors,
          email: 'Network error. Please check your connection and try again.'
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrors({
          ...errors,
          email: 'An unexpected error occurred. Please try again later.'
        });
      }
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
          <h2>Create an Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="log-login-form">
          <div className="log-form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="log-error-message">{errors.name}</p>}
          </div>
          
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
            {errors.email && <p className="log-error-message">{errors.email}</p>}
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
            {errors.password && <p className="log-error-message">{errors.password}</p>}
          </div>
          
          <div className="log-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="log-password-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span className="log-eye-icon" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {errors.confirmPassword && <p className="log-error-message">{errors.confirmPassword}</p>}
          </div>
          
          <button 
            type="submit" 
            className="log-login-btn"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          
          <div className="log-register-prompt">
            <p>Already have an account? <Link to="/login">Login Now</Link></p>
          </div>
        </form>
        
        <div className="log-login-footer">
          <p>&copy; {new Date().getFullYear()} Jay Agencies - All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;