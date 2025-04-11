import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String, // will store filename or image URL
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false, // Regular users by default
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
