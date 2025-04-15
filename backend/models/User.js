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
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'], // Email validation
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "", // Optional, can be updated later
    },
    address: {
      type: String,
      default: "", // Optional, can be updated later
    },
    profilePic: {
      type: String,
      default: "", // Optional, can be updated later
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
