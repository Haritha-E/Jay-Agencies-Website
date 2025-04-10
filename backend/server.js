import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // 🔥 Serve static images

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes); // ✅ New Product Route
app.use("/uploads", express.static("uploads"));
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((error) => console.log("❌ MongoDB Connection Failed:", error));
