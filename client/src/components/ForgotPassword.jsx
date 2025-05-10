import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {API_URL } from "../api";

import './Login.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email,
        origin: window.location.origin 
      });
      setSubmitted(true);
      toast.success('Password reset email sent! Please check your inbox.');
    } catch (error) {
      console.error('Forgot password error:', error);
      
      if (error.response && error.response.status === 404) {
        setError('No account found with that email address');
      } else {
        setError('An error occurred. Please try again later.');
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
          <h2>Forgot Password</h2>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="log-login-form">
            {error && <p className="log-error-message">{error}</p>}
            
            <div className="log-forgot-instruction">
              <p>Enter your email address and we'll send you a link to reset your password.</p>
            </div>
            
            <div className="log-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="log-login-btn"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <div className="log-return-to-login">
              <Link to="/login">Back to Login</Link>
            </div>
          </form>
        ) : (
          <div className="log-success-message">
            <div className="log-success-icon">✓</div>
            <h3>Check Your Email</h3>
            <p>We've sent a password reset link to <strong>{email}</strong></p>
            <p className="log-email-instructions">
              Please check your inbox and follow the instructions to reset your password.
              The link will expire in 1 hour.
            </p>
            <div className="log-return-to-login">
              <Link to="/login">Return to Login</Link>
            </div>
          </div>
        )}
        
        <div className="log-login-footer">
          <p>&copy; {new Date().getFullYear()} Jay Agencies - All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;