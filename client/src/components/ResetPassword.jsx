import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
        setError('The password reset link is invalid or has expired');
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword((prev) => !prev);
    } else {
      setShowConfirmPassword((prev) => !prev);
    }
  };

const validatePasswords = () => {
  const { password, confirmPassword } = formData;

  const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  if (!passwordRegex.test(password)) {
    setError('Password must be at least 8 characters long and contain at least one special character');
    return false;
  }

  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return false;
  }

  return true;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(`${API_URL}/api/auth/reset-password/${token}`, { 
        password: formData.password 
      });
      
      toast.success('Password reset successful! You can now log in with your new password.');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      
      if (error.response && error.response.status === 400) {
        setError('The password reset link is invalid or has expired');
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="log-login-container">
        <div className="log-login-form-section" style={{ width: '100%' }}>
          <div className="log-loading">
            <p>Validating your request...</p>
          </div>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="log-login-container">
        <div className="log-login-form-section" style={{ width: '100%' }}>
          <div className="log-login-header">
            <img src="/jay_logo.png" alt="Jay Agencies Logo" className="log-logo" />
            <h2>Invalid Link</h2>
          </div>
          <div className="log-error-container">
            <p className="log-error-message">{error}</p>
            <p>Please request a new password reset link.</p>
            <div className="log-action-links">
              <Link to="/forgot-password" className="log-primary-link">Request New Link</Link>
              <Link to="/login" className="log-secondary-link">Return to Login</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <h2>Reset Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="log-login-form">
          {error && <p className="log-error-message">{error}</p>}
          
          <div className="log-reset-instruction">
            <p>Please enter your new password below.</p>
          </div>
          
          <div className="log-form-group">
            <label htmlFor="password">New Password</label>
            <div className="log-password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
              />
              <span className="log-eye-icon" onClick={() => togglePasswordVisibility('password')}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <small className="log-password-requirements">
              Must be at least 8 characters and include a special character
            </small>
          </div>
          
          <div className="log-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="log-password-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span className="log-eye-icon" onClick={() => togglePasswordVisibility('confirm')}>
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="log-login-btn"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          
          <div className="log-return-to-login">
            <Link to="/login">Back to Login</Link>
          </div>
        </form>
        
        <div className="log-login-footer">
          <p>&copy; {new Date().getFullYear()} Jay Agencies - All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;