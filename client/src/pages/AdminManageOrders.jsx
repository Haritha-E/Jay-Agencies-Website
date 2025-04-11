import React, { useEffect, useState } from "react";
import { getAllOrders, markOrderDelivered } from "../api";
import { toast } from "react-toastify";
import "./AdminManageOrders.css";
import "react-toastify/dist/ReactToastify.css";

const AdminManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryConfirmation = async (orderId) => {
    const confirm = window.confirm("Are you sure you want to mark this order as Delivered?");
    if (!confirm) return;

    try {
      await markOrderDelivered(orderId);
      toast.success("Order marked as Delivered!");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order status.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  if (loading) return <div className="admin-loading">Loading orders...</div>;

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-header">
        <h2>Manage Orders</h2>
        <div className="admin-filter">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Placed">Placed</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="no-orders">No {filter.toLowerCase()} orders found.</p>
      ) : (
        <div className="admin-order-grid">
          {filteredOrders.map((order) => {
            const orderTotal = order.products.reduce(
              (sum, item) => sum + item.quantity * (item.productId?.price || 0),
              0
            );

            return (
              <div className="admin-order-card" key={order._id}>
                <div className="admin-order-info">
                  <h4>Order #{order._id.slice(-6).toUpperCase()}</h4>
                  <p><strong>Customer:</strong> {order.user?.name} ({order.user?.email})</p>
                  <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                  {order.status === "Delivered" && (
                    <p className="delivered-time">
                        <strong>Delivered:</strong>{" "}
                        {order.deliveredAt
                        ? new Date(order.deliveredAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
                        : "N/A"}
                    </p>
                    )}

                  <p><strong>Total:</strong> ₹{orderTotal}</p>

                  <div className="admin-status">
                    <span className={`badge ${order.status === "Delivered" ? "delivered" : "placed"}`}>
                      {order.status}
                    </span>

                    {order.status !== "Delivered" && (
                      <button
                        className="mark-delivered-btn"
                        onClick={() => handleDeliveryConfirmation(order._id)}
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>

                <div className="admin-order-products">
                  {order.products.map((item) => (
                    <div key={item._id} className="admin-product">
                      <img
                        src={`http://localhost:5000/uploads/products/${item.productId?.image}`}
                        alt={item.productId?.name}
                        onError={(e) => (e.target.src = "/default-product.png")}
                      />
                      <div>
                        <p className="product-name">{item.productId?.name}</p>
                        <p>Qty: {item.quantity}</p>
                        <p>₹{item.productId?.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminManageOrders;
