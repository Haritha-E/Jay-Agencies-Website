import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./AdminAnalytics.css"; // Create a CSS file if needed

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00bcd4"];

const AdminAnalytics = () => {
  const [monthlySales, setMonthlySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMonthlySales(response.data.monthlyTurnover);
      setTopProducts(response.data.topSellingProducts);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-analytics-page">
      <h1>Sales Analytics</h1>

      <div className="chart-section">
        <div className="chart-container">
          <h2>Monthly Turnover</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySales}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" name="Total Sales (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h2>Top Selling Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topProducts}
                dataKey="sold"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {topProducts.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
