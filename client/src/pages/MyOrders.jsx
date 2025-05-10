import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaClock, FaSort, FaFilter, FaAngleDown, FaBox } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import "./MyOrders.css"; 

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("Newest");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/orders/myorders`, {
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
    let filtered = statusFilter === "All"
      ? [...orders]
      : orders.filter((order) => order.status === statusFilter);
  
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });
  
    setFilteredOrders(filtered);
  }, [statusFilter, sortOrder, orders]);
  
  useEffect(() => {
    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const calculateTotalPrice = (products) => {
    return products.reduce((total, item) => total + item.quantity * (item.productId.price || 0), 0);
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header-wrapper">
        <div className="orders-header">
          <div className="header-left">
            <h2>My Orders</h2>
            <span className="order-count">{filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}</span>
          </div>
          <div className="filters-container">
            <div className="filter-group">
              <div className="filter-icon"><FaFilter /></div>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Placed">Placed</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div className="filter-group">
              <div className="filter-icon"><FaSort /></div>
              <select
                className="filter-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <div className="empty-state">
            <FaBox size={48} />
            <h3>No orders found</h3>
            <p>No orders match your current filter selection.</p>
          </div>
        </div>
      ) : (
        <div className="order-list">
          {filteredOrders.map((order) => {
            const totalPrice = calculateTotalPrice(order.products);
            const isExpanded = expandedOrderId === order._id;
            const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", { 
              timeZone: "Asia/Kolkata",
              day: 'numeric',
              month: 'short', 
              year: 'numeric'
            });
            
            const expectedDeliveryDate = new Date(new Date(order.createdAt).getTime() + 10 * 24 * 60 * 60 * 1000)
              .toLocaleDateString("en-IN", { 
                timeZone: "Asia/Kolkata",
                day: 'numeric',
                month: 'short', 
                year: 'numeric'
              });

            const deliveredDate = order.deliveredAt && new Date(order.deliveredAt).toLocaleDateString("en-IN", { 
              timeZone: "Asia/Kolkata",
              day: 'numeric',
              month: 'short', 
              year: 'numeric'
            });

            return (
              <div key={order._id} className={`order-card ${isExpanded ? 'expanded' : ''}`}>
                <div className="order-summary" onClick={() => toggleOrderExpand(order._id)}>
                  <div className="order-info">
                    <div className="order-id-date">
                      <h4>Order ID: {order._id}</h4>
                      <span className="order-date">{orderDate}</span>
                    </div>
                    <div className="order-status-price">
                      <div className={`order-status ${order.status.toLowerCase()}`}>
                        {order.status === "Delivered" ? (
                          <><FaCheckCircle /> Delivered</>
                        ) : (
                          <><FaClock /> {order.status}</>
                        )}
                      </div>
                      <div className="order-price">₹{totalPrice.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="expand-icon">
                    <FaAngleDown className={isExpanded ? 'rotate' : ''} />
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="order-details">
                    <div className="order-timeline">
                      <div className="timeline-event">
                        <div className="timeline-icon completed">
                          <FaCheckCircle />
                        </div>
                        <div className="timeline-content">
                          <h5>Order Placed</h5>
                          <p>{orderDate}</p>
                        </div>
                      </div>
                      
                      <div className="timeline-connector"></div>
                      
                      <div className={`timeline-event ${order.status === "Delivered" ? 'completed' : 'pending'}`}>
                        <div className={`timeline-icon ${order.status === "Delivered" ? 'completed' : 'pending'}`}>
                          {order.status === "Delivered" ? <FaCheckCircle /> : <FaClock />}
                        </div>
                        <div className="timeline-content">
                          <h5>Delivery{order.status === "Delivered" ? '' : ' Expected'}</h5>
                          <p>{order.status === "Delivered" ? deliveredDate : expectedDeliveryDate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="order-products-container">
                      <h5 className="products-heading">Items in this order</h5>
                      <div className="order-products">
                        {order.products.map((item) => (
                          <div key={item._id} className="order-product">
                            <div className="order-product-image">
                              <img src={`${API_URL}/uploads/products/${item.productId.image}`} alt={item.productId.name} />
                            </div>
                            <div className="product-details">
                              <h5>{item.productId.name}</h5>
                              <div className="product-meta">
                                <span>Qty: {item.quantity}</span>
                                <span>₹{item.productId.price}</span>
                              </div>
                              <div className="product-subtotal">
                                Subtotal: ₹{(item.quantity * item.productId.price).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="order-summary-section">
                      <div className="summary-item">
                        <span>Total Items:</span>
                        <span>{order.products.reduce((sum, item) => sum + item.quantity, 0)}</span>
                      </div>
                      <div className="summary-item total">
                        <span>Order Total:</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;