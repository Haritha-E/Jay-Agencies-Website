import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// GET: Get current user profile
router.get("/profile", protect, getUserProfile);

// PUT: Update profile info (with image upload)
router.put("/profile", protect, upload.single("profilePic"), updateUserProfile);

export default router;
