import Order from "../models/Order.js";

// 🟢 User: Place a new order
export const placeOrder = async (req, res) => {
  try {
    const { products, address, phone, total } = req.body;

    const order = new Order({
      user: req.user._id,
      products,
      address,
      phone,
      total,
      status: "Placed",
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// 🟡 User: Get their own orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("products.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your orders" });
  }
};

// 🔴 Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

// 🟢 Admin: Mark order as delivered
export const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id); // 🛠️ FIXED this line

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "Delivered";
    order.deliveredAt = new Date(); 
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};
