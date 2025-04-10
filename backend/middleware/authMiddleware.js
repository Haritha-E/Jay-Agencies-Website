import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // ⏰ This throws error if token expired

      req.user = await User.findById(decoded.id).select("-password");

      return next(); // ✅ Success
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return res.status(401).json({
        message:
          error.name === "TokenExpiredError"
            ? "Session expired. Please login again."
            : "Not authorized, token failed",
      });
    }
  }

  // ⛔ Only runs if no token present at all
  return res.status(401).json({ message: "Not authorized, no token" });
};
