import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },

    stock: { type: Number, required: true, default: 0 },
    availability: {
      type: String,
      enum: ["Available", "Out of Stock"],
      default: "Available"
    },

    sold: { type: Number, default: 0 }
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.availability = this.stock > 0 ? "Available" : "Out of Stock";
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
