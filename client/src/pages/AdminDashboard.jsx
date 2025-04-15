import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaShoppingCart, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import "./AdminDashboard.css";

const AdminDashboard = ({onLogout}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    onLogout(); 
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-card" onClick={() => navigate("/admin/products")}>
          <FaBoxOpen className="dashboard-icon" />
          <h2>Manage Products</h2>
          <p>View, update, or remove existing products.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/admin/orders")}>
          <FaShoppingCart className="dashboard-icon" />
          <h2>Manage Orders</h2>
          <p>Track and process customer orders.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/admin/sales-report")}>
          <FaChartBar className="dashboard-icon" />
          <h2>Sales Report</h2>
          <p>Analyze sales performance and generate reports.</p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
