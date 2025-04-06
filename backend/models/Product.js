import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  size: String,
  description: String,
  image: String, // Now just the filename
});

export default mongoose.model("Product", productSchema);
