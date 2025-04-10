import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyOrders.css";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
    const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/orders/myorders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => order.status === statusFilter);
      setFilteredOrders(filtered);
    }
  }, [statusFilter, orders]);

  useEffect(() => {
    const handlePopState = () => {
      navigate("/", { replace: true });
    };
  
    window.addEventListener("popstate", handlePopState);
  
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
  

  if (loading) return <div className="loading">Loading your orders...</div>;

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>My Orders</h2>
        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Placed">Placed</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="no-orders">No orders found for this filter.</p>
      ) : (
        <div className="order-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <h4>Order ID: {order._id.slice(-6).toUpperCase()}</h4>
              <p><strong>Ordered on:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> 
                {order.status === "Delivered" ? (
                  <span className="delivered"><FaCheckCircle /> Delivered</span>
                ) : (
                  <span className="pending"><FaClock /> {order.status}</span>
                )}
              </p>

              <div className="order-products">
                {order.products.map((item) => (
                  <div key={item._id} className="order-product">
                    <img src={`http://localhost:5000/uploads/products/${item.productId.image}`} alt={item.productId.name} />
                    <div>
                      <h5>{item.productId.name}</h5>
                      <p>Qty: {item.quantity}</p>
                      <p>Price: ₹{item.productId.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
