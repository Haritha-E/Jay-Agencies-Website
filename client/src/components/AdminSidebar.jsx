// src/components/AdminSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <ul>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/products">Products</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
          <li><Link to="/admin/orders">Orders</Link></li>
          <li><Link to="/">Go to Home</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
